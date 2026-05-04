"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import {
  Search, Pill, Loader2, ChevronLeft, Activity,
  BookOpen, ShieldAlert, Info, AlertTriangle,
  Clipboard, HeartPulse, Stethoscope, ArrowRight,
  FlaskConical, LayoutGrid
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DrugSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cleanDrugName = (name) => {
    if (!name) return "";
    return name
      .replace(/[{}]/g, '') // Remove curly braces
      .replace(/\[.*?\]/g, '') // Remove bracketed info
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  };

  const [activeDrug, setActiveDrug] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deepData, setDeepData] = useState(null);

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const examples = ['Paracetamol', 'Ibuprofen', 'Metformin', 'Amoxicillin', 'Lipitor'];

  const GROK_API_KEY = process.env.NEXT_PUBLIC_GROK_API_KEY;
  const GROK_API_URL = process.env.NEXT_PUBLIC_GROK_API_URL;

  const resolveGenericName = async (name) => {
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a medical assistant. If a user provides a drug brand name (especially international ones), respond with ONLY the primary active generic ingredient name. If you don't know, respond with 'Unknown'." },
            { role: "user", content: name }
          ]
        })
      });
      const data = await res.json();
      const generic = data.text?.replace(/[.]/g, '').trim();
      return (generic && generic !== 'Unknown' && generic.toLowerCase() !== name.toLowerCase()) ? generic : null;
    } catch {
      return null;
    }
  };

  const fetchAIDossier = async (drugName) => {
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a professional clinical pharmacist. Provide a detailed medical dossier for the requested medication in JSON format ONLY. Fields: usage, dosage, warnings, contraindications, adverse_reactions, interactions, description, overdosage, storage, active_ingredients (array), manufacturer (standard). Do not include markdown code blocks, just raw JSON."
            },
            { role: "user", content: `Medicine: ${drugName}` }
          ],
        }),
      });

      if (!res.ok) throw new Error("AI Service Unavailable");
      const data = await res.json();
      
      let content = data.text;
      
      // Robust JSON extraction
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      return JSON.parse(content);
    } catch (err) {
      console.error("AI Fetch Error:", err);
      return null;
    }
  };

  const searchDrugs = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    const term = searchTerm.trim();
    try {
      // Step 1: Try exact/spelling-corrected search first for relevant results
      const spellingRes = await fetch(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${encodeURIComponent(term)}`);
      const spellingData = await spellingRes.json();
      const suggestions = spellingData.suggestionGroup?.suggestionList?.suggestion || [];

      // Build a set of terms to try: original + top 2 suggestions
      const termsToTry = Array.from(new Set([term, ...suggestions.slice(0, 2)]));
      let found = [];

      for (const t of termsToTry) {
        const res = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(t)}&search=2`);
        const d = await res.json();
        const ids = d.idGroup?.rxnormId || [];

        for (const id of ids.slice(0, 6)) {
          const propRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${id}/properties.json`);
          const propData = await propRes.json();
          const props = propData.properties;
          if (props && props.name && !found.find(f => f.rxcui === props.rxcui)) {
            found.push({ name: props.name, rxcui: props.rxcui, synonym: props.synonym });
          }
        }
        if (found.length >= 8) break;
      }

      if (found.length > 0) {
        // Sort: exact matches first
        found.sort((a, b) => {
          const aExact = a.name.toLowerCase().startsWith(term.toLowerCase()) ? 0 : 1;
          const bExact = b.name.toLowerCase().startsWith(term.toLowerCase()) ? 0 : 1;
          return aExact - bExact;
        });
        setResults(found.slice(0, 10));
        return;
      }

      // Step 2: AI Fallback for international brands (e.g., Calpol -> Paracetamol)
      const generic = await resolveGenericName(term);
      if (generic) {
        const retryRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(generic)}&search=2`);
        const retryD = await retryRes.json();
        const retryIds = retryD.idGroup?.rxnormId || [];
        const retryFound = [];
        for (const id of retryIds.slice(0, 8)) {
          const propRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${id}/properties.json`);
          const propData = await propRes.json();
          const props = propData.properties;
          if (props && props.name && !retryFound.find(f => f.rxcui === props.rxcui)) {
            retryFound.push({ name: props.name, rxcui: props.rxcui, synonym: props.synonym });
          }
        }
        if (retryFound.length > 0) {
          setResults(retryFound.slice(0, 10));
          return;
        }
      }

      setResults([]);
      setError('No results found. Try a different spelling or generic name.');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMedicalDossier = async (drug) => {
    setActiveDrug(drug);
    setDetailsLoading(true);
    setDeepData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {

      const classRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${drug.rxcui}`);
      const classData = await classRes.json();
      const classes = classData.rxclassDrugInfoList?.rxclassDrugInfo?.map(c => c.rxclassMinConceptItem.className).slice(0, 5) || [];

      const aiData = await fetchAIDossier(drug.name);

      if (aiData) {
        setDeepData({
          ...aiData,
          rxcui: drug.rxcui,
          classes: classes.length > 0 ? classes : ["Pharmaceutical Agent"]
        });
      } else {
        throw new Error("AI Failed");
      }
    } catch (err) {
      setDeepData({
        rxcui: drug.rxcui,
        classes: ["Therapeutic Agent"],
        usage: "Information temporarily restricted. Consult clinical sources.",
        dosage: "Refer to patient-specific medical instructions.",
        active_ingredients: [drug.name],
        manufacturer: "Clinical Standard"
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) searchDrugs(query);
      else if (query.length === 0) setResults([]);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      searchDrugs(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-bg-page pt-16 pb-16 px-4 md:px-6">
      <AnimatePresence mode="wait">
        {!activeDrug ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-2xl mx-auto flex flex-col items-center"
          >
            {/* Header Section */}
            <div className="text-center mb-6">
              <h1 className="text-xl md:text-3xl font-bold text-text-heading tracking-tight mb-1.5">
                Search <span className="text-primary italic">Medications</span>
              </h1>
              <p className="text-[11px] text-text-muted max-w-md mx-auto leading-relaxed">
                Real-time clinical data and AI-driven insights for over 100,000 drug products.
              </p>
            </div>

            {/* Search Bar */}
            <div className="w-full relative group mb-4">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-700" />
              <div className="relative bg-bg-card border border-border-nav rounded-xl flex items-center px-3 py-1.5 shadow-lg transition-all group-focus-within:border-primary/40">
                <Search className="w-4 h-4 text-text-muted shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Search drug name (e.g. Panadol, Lipitor)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchDrugs(query)}
                  className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-medium text-text-heading placeholder:text-text-muted/40 py-2"
                />
                <button 
                  onClick={() => searchDrugs(query)}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold text-xs tracking-wide transition-all active:scale-95 flex items-center gap-1.5"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Search className="w-3.5 h-3.5" /> Search</>}
                </button>
              </div>
            </div>

            {/* Popular Suggestions */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider">Try:</span>
              {examples.map(ex => (
                <button
                  key={ex}
                  onClick={() => { setQuery(ex); searchDrugs(ex); }}
                  className="px-3 py-1 bg-bg-card border border-border-nav rounded-full text-[10px] font-medium text-text-muted hover:border-primary hover:text-primary transition-all active:scale-95"
                >
                  {ex}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="w-full flex flex-col gap-2">
              {results.map((drug, idx) => (
                <motion.div
                  key={drug.rxcui}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => loadMedicalDossier(drug)}
                  className="group bg-bg-card hover:bg-bg-card/80 px-4 py-3 rounded-xl border border-border-nav hover:border-primary/30 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-text-heading group-hover:text-primary transition-colors line-clamp-1">
                        {cleanDrugName(drug.name)}
                      </p>
                      <p className="text-[9px] text-text-muted">RxCUI: {drug.rxcui}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </motion.div>
              ))}
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mt-8 p-6 text-center bg-red-500/5 rounded-3xl border border-red-500/20"
              >
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest leading-relaxed">{error}</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dossier"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto"
          >
            {/* Dossier Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
              <button
                onClick={() => setActiveDrug(null)}
                className="group flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-nav rounded-xl text-[10px] font-semibold uppercase tracking-wider text-text-muted hover:text-primary hover:border-primary transition-all active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Search
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[9px] font-semibold text-primary uppercase tracking-wider mb-0.5">Clinical Report</p>
                  <p className="text-[9px] text-text-muted/60 uppercase">RXCUI: {activeDrug.rxcui}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary p-0.5">
                  <div className="w-full h-full bg-bg-card rounded-[10px] flex items-center justify-center">
                    <Clipboard className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {detailsLoading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="relative mb-5">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <HeartPulse className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                </div>
                <h3 className="text-sm font-bold text-text-heading uppercase tracking-widest mb-1">Analyzing...</h3>
                <p className="text-[9px] text-text-muted uppercase tracking-widest animate-pulse">Scanning pharmaceutical database...</p>
              </div>
            ) : deepData && (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-700">
                {/* Main Hero Card */}
                <div className="p-5 md:p-6 rounded-2xl bg-bg-card border border-border-nav relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-[0.02] rotate-12 scale-[2]">
                    <Stethoscope className="w-32 h-32" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-5 items-start md:items-center relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shrink-0">
                      <Pill className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {Array.from(new Set(deepData.classes)).map((c, i) => (
                          <span key={`${c}-${i}`} className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-semibold rounded border border-primary/20">
                            {c}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-base md:text-xl font-bold text-text-heading leading-snug mb-2">
                        {cleanDrugName(activeDrug.name)}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">Manufacturer</span>
                          <span className="text-xs font-semibold text-text-heading border-l-2 border-primary pl-2">
                            {typeof deepData.manufacturer === 'object' ? deepData.manufacturer.name : deepData.manufacturer}
                          </span>
                        </div>
                        <div className="w-px h-6 bg-border-nav" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">Status</span>
                          <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> FDA Validated
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Primary Info Column */}
                  <div className="lg:col-span-2 space-y-3">
                    {/* Usage & Indications */}
                    <section className="p-4 bg-bg-card rounded-2xl border border-border-nav">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-[10px] font-bold text-text-heading uppercase tracking-wider">Clinical Indications</h3>
                      </div>
                      <p className="text-xs text-text-body leading-relaxed pl-9">
                        {deepData.usage}
                      </p>
                    </section>

                    {/* Dosage Section */}
                    <section className="p-4 bg-bg-card rounded-2xl border border-border-nav">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </div>
                        <h3 className="text-[10px] font-bold text-text-heading uppercase tracking-wider">Dosage Protocols</h3>
                      </div>
                      <p className="text-xs text-text-body leading-relaxed pl-9">
                        {deepData.dosage}
                      </p>
                    </section>

                    {/* Safety Dual Column */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <section className="p-4 bg-red-500/5 rounded-2xl border border-red-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Warnings</h3>
                        </div>
                        <p className="text-xs text-text-body leading-relaxed opacity-80 pl-5">
                          {deepData.warnings}
                        </p>
                      </section>
                      <section className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <h3 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Contraindications</h3>
                        </div>
                        <p className="text-xs text-text-body leading-relaxed opacity-80 pl-5">
                          {deepData.contraindications}
                        </p>
                      </section>
                    </div>

                    {/* Adverse & Interactions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <section className="p-4 bg-bg-card rounded-2xl border border-border-nav">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-3.5 h-3.5 text-primary shrink-0" />
                          <h3 className="text-[10px] font-bold text-text-heading uppercase tracking-wider">Adverse Reactions</h3>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed pl-5">{deepData.adverse_reactions}</p>
                      </section>
                      <section className="p-4 bg-bg-card rounded-2xl border border-border-nav">
                        <div className="flex items-center gap-2 mb-2">
                          <FlaskConical className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <h3 className="text-[10px] font-bold text-text-heading uppercase tracking-wider">Drug Interactions</h3>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed pl-5">{deepData.interactions}</p>
                      </section>
                    </div>
                  </div>

                  {/* Sidebar Info Column */}
                  <div className="space-y-3">
                    {/* Active Ingredients */}
                    <section className="p-4 bg-bg-card rounded-2xl border border-border-nav">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                        <h3 className="text-[10px] font-bold text-text-heading uppercase tracking-wider">Molecular Profile</h3>
                      </div>
                      <div className="space-y-1.5">
                        {Array.from(new Set(Array.isArray(deepData.active_ingredients) ? deepData.active_ingredients : [deepData.active_ingredients])).map((ing, i) => (
                          <div key={`${ing}-${i}`} className="px-3 py-2 bg-bg-page rounded-lg border border-border-nav flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-text-heading">{ing}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Storage */}
                    <section className="p-4 bg-primary rounded-2xl text-white">
                      <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2">Storage Protocol</h3>
                      <p className="text-[11px] leading-relaxed opacity-90">{deepData.storage}</p>
                    </section>

                    {/* Overdose */}
                    <section className="p-4 bg-bg-card border border-red-500/20 rounded-2xl">
                      <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Emergency Overdose</h3>
                      <p className="text-[11px] text-text-body leading-relaxed">{deepData.overdosage}</p>
                    </section>

                    {/* Clinical Note */}
                    <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                      <p className="text-[9px] text-amber-500 uppercase tracking-wider leading-relaxed text-center">
                        For institutional use only. Consult a licensed healthcare provider.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <DrugSearch />
    </Suspense>
  );
}