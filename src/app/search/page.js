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

  // Detail State
  const [activeDrug, setActiveDrug] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [deepData, setDeepData] = useState(null);

  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const examples = ['Paracetamol', 'Ibuprofen', 'Metformin', 'Amoxicillin', 'Lipitor'];

  const GROK_API_KEY = process.env.NEXT_PUBLIC_GROK_API_KEY;
  const GROK_API_URL = process.env.NEXT_PUBLIC_GROK_API_URL;

  const fetchAIDossier = async (drugName) => {
    try {
      const res = await fetch(GROK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a professional clinical pharmacist. Provide a detailed medical dossier for the requested medication in JSON format ONLY. Fields: usage, dosage, warnings, contraindications, adverse_reactions, interactions, description, overdosage, storage, active_ingredients (array), manufacturer (standard). Do not include markdown code blocks, just raw JSON."
            },
            { role: "user", content: `Medicine: ${drugName}` }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        }),
      });

      if (!res.ok) throw new Error("AI Service Unavailable");
      const data = await res.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (err) {
      console.error("AI Fetch Error:", err);
      return null;
    }
  };

  const searchDrugs = async (searchTerm) => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    try {
      // 1. RxNav Search for Candidates
      const response = await fetch(`https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${searchTerm}`);
      const data = await response.json();

      if (data.approximateGroup?.candidate) {
        const candidates = data.approximateGroup.candidate
          .filter(item => item.name)
          .reduce((acc, current) => {
            if (!acc.find(item => item.rxcui === current.rxcui)) acc.push(current);
            return acc;
          }, []);
        setResults(candidates.slice(0, 10));
      } else {
        setResults([]);
        setError("Clinical database returned no matches.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
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
      // 1. RxNav Classes
      const classRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${drug.rxcui}&relaSource=ATC`);
      const classData = await classRes.json();
      const classes = classData.rxclassDrugInfoList?.rxclassDrugInfo?.map(c => c.rxclassMinConceptItem.className).slice(0, 5) || [];

      // 2. Grok AI Deep Insights
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

  // --- VIEWS ---

  return (
    <div className="min-h-screen bg-bg-page pt-14 pb-20 px-4 md:px-6">
      <AnimatePresence mode="wait">
        {!activeDrug ? (

          // SEARCH VIEW
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
                <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary">Global Health Database</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-text-heading tracking-tight mb-3">
                Clinical <span className="text-primary italic">Intelligence</span>
              </h1>
              <p className="text-[13px] text-text-muted font-medium max-w-lg mx-auto leading-relaxed">
                Identify medications, understand dosage, and review FDA safety data instantly through our advanced medical search engine.
              </p>
            </div>

            {/* Search Box */}
            <div className="relative group mb-10">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-20 group-focus-within:opacity-100 transition duration-500" />
              <div className="relative bg-bg-card rounded-xl border border-border-nav shadow-lg p-1.5 flex items-center transition-all">
                <div className="px-4">
                  <Search className="w-5 h-5 text-text-muted" />
                </div>
                <input
                  type="text"
                  placeholder="Search over 100,000 medications..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow bg-transparent border-none focus:ring-0 text-base font-bold text-text-heading placeholder:text-text-muted/40 py-3"
                />
                {loading && <Loader2 className="w-5 h-5 text-primary animate-spin mr-4" />}
              </div>

              {/* Examples */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {examples.map(ex => (
                  <button
                    key={ex}
                    onClick={() => { setQuery(ex); searchDrugs(ex); }}
                    className="px-3 py-1.5 bg-bg-card border border-border-nav rounded-lg text-[10px] font-bold text-text-muted hover:border-primary hover:text-primary transition-all active:scale-95 shadow-sm"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((drug, idx) => (
                <motion.div
                  key={drug.rxcui}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => loadMedicalDossier(drug)}
                  className="group bg-bg-card p-4 rounded-2xl border border-border-nav hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-bg-page flex items-center justify-center text-primary group-hover:bg-primary/5 transition-colors shadow-inner">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-text-heading group-hover:text-primary transition-colors">{drug.name}</h3>
                      <p className="text-[9px] font-semibold text-text-muted uppercase tracking-widest mt-0.5">ID: {drug.rxcui}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </motion.div>
              ))}
            </div>

            {error && (
              <div className="py-12 text-center bg-red-50/50 rounded-2xl border border-red-100">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                <p className="text-[11px] font-bold text-red-800 uppercase tracking-widest">{error}</p>
              </div>
            )}
          </motion.div>

        ) : (

          // DETAIL VIEW (Dossier Mode)
          <motion.div
            key="dossier"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-5xl mx-auto"
          >
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <button
                onClick={() => setActiveDrug(null)}
                className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border-nav rounded-xl text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Search
              </button>
              <div className="flex items-center gap-2.5">
                <div className="text-right hidden xs:block">
                  <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">Clinical Report</p>
                  <p className="text-[10px] font-semibold text-text-muted uppercase">ID: {activeDrug.rxcui}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                  <Clipboard className="w-5 h-5" />
                </div>
              </div>
            </div>

            {detailsLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <HeartPulse className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-text-heading uppercase tracking-widest">Medical Analysis</h3>
                  <p className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.3em] mt-1.5">Querying Clinical Records...</p>
                </div>
              </div>
            ) : deepData && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                {/* Title Card - Compact */}
                <div className="p-6 md:p-8 rounded-[2rem] bg-bg-card border border-border-nav shadow-md flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 scale-[2]">
                    <Stethoscope className="w-32 h-32" />
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shrink-0 shadow-inner">
                    <Pill className="w-8 h-8" />
                  </div>
                  <div className="relative z-10 flex-grow">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-heading tracking-tight mb-3">{activeDrug.name}</h2>
                    <div className="flex flex-wrap gap-1.5">
                      {deepData.classes.length > 0 ? deepData.classes.map(c => (
                        <span key={c} className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-bold rounded-lg border border-primary/10 tracking-widest uppercase">{c}</span>
                      )) : <span className="px-3 py-1 bg-bg-page text-gray-400 text-[9px] font-bold rounded-lg border border-border-nav tracking-widest uppercase">General Pharmaceutical</span>}
                    </div>
                  </div>
                  <div className="md:w-px h-10 bg-border-nav hidden md:block" />
                  <div className="text-left md:text-right shrink-0">
                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-0.5">Manufacturer</p>
                    <p className="text-[13px] font-bold text-text-heading">{deepData.manufacturer}</p>
                  </div>
                </div>

                {/* Info Grid - High Density */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                  {/* Left Column: Deep Medical Data */}
                  <div className="md:col-span-8 space-y-6">

                    {/* Usage & Purpose */}
                    <div className="p-6 bg-bg-card rounded-3xl border border-border-nav shadow-sm">
                      <div className="flex items-center gap-2.5 mb-4">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <h3 className="text-[11px] font-bold text-text-heading uppercase tracking-[0.2em]">Usage & Indications</h3>
                      </div>
                      <p className="text-[13px] text-text-body font-medium leading-relaxed opacity-80">{deepData.usage}</p>
                    </div>

                    {/* Adverse Reactions & Interactions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-6 bg-amber-50/30 rounded-3xl border border-amber-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="w-4 h-4 text-amber-600" />
                          <h4 className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Adverse Reactions</h4>
                        </div>
                        <p className="text-[11px] text-amber-900 font-medium leading-relaxed line-clamp-6">{deepData.adverse_reactions}</p>
                      </div>
                      <div className="p-6 bg-purple-50/30 rounded-3xl border border-purple-100">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-purple-600" />
                          <h4 className="text-[9px] font-bold text-purple-700 uppercase tracking-widest">Interactions</h4>
                        </div>
                        <p className="text-[11px] text-purple-900 font-medium leading-relaxed line-clamp-6">{deepData.interactions}</p>
                      </div>
                    </div>

                    {/* Dosage & Admin */}
                    <div className="p-6 bg-primary/[0.02] rounded-3xl border border-primary/5">
                      <div className="flex items-center gap-2.5 mb-4">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                        <h3 className="text-[11px] font-bold text-text-heading uppercase tracking-[0.2em]">Dosage Instructions</h3>
                      </div>
                      <div className="text-[12px] text-text-body font-medium leading-relaxed bg-bg-card/40 p-5 rounded-xl border border-border-nav/40 shadow-inner">
                        {deepData.dosage}
                      </div>
                    </div>

                    {/* Safety Panel */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="p-6 bg-red-50/40 rounded-3xl border border-red-100">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <h4 className="text-[9px] font-bold text-red-700 uppercase tracking-widest">Safety Warnings</h4>
                        </div>
                        <p className="text-[11px] text-red-800 font-semibold leading-relaxed opacity-70">{deepData.warnings}</p>
                      </div>
                      <div className="p-6 bg-secondary/[0.03] rounded-3xl border border-secondary/5">
                        <div className="flex items-center gap-2 mb-3">
                          <ShieldAlert className="w-4 h-4 text-secondary" />
                          <h4 className="text-[9px] font-bold text-secondary uppercase tracking-widest">Precautions</h4>
                        </div>
                        <p className="text-[11px] text-secondary font-semibold leading-relaxed opacity-70">{deepData.contraindications}</p>
                      </div>
                    </div>

                    {/* Clinical Description */}
                    <div className="p-6 bg-bg-card rounded-3xl border border-border-nav shadow-sm">
                      <div className="flex items-center gap-2.5 mb-4">
                        <Info className="w-5 h-5 text-text-muted" />
                        <h3 className="text-[11px] font-bold text-text-heading uppercase tracking-[0.2em]">Clinical Description</h3>
                      </div>
                      <p className="text-[12px] text-text-body font-medium leading-relaxed opacity-70 italic">{deepData.description}</p>
                    </div>
                  </div>

                  {/* Right Column: Specifications */}
                  <div className="md:col-span-4 space-y-6">

                    {/* Active Ingredients */}
                    <div className="p-6 bg-bg-card rounded-3xl border border-border-nav shadow-sm">
                      <div className="flex items-center gap-2.5 mb-4">
                        <FlaskConical className="w-4 h-4 text-primary" />
                        <h4 className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Constituents</h4>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {(Array.isArray(deepData.active_ingredients) ? deepData.active_ingredients : [deepData.active_ingredients]).map(ing => (
                          <div key={ing} className="p-3 bg-bg-page rounded-lg border border-border-nav text-[10px] font-bold text-text-heading uppercase tracking-tighter">
                            {ing}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Overdosage */}
                    <div className="p-6 bg-red-600 rounded-3xl text-white shadow-lg">
                      <h4 className="text-[15px] font-bold  uppercase tracking-widest mb-3">Overdosage Protocol</h4>
                      <p className="text-[11px] font-semibold leading-relaxed">{deepData.overdosage}</p>
                    </div>

                    {/* Storage */}
                    <div className="p-6 bg-bg-card border border-border-nav rounded-3xl text-text-heading shadow-lg">
                      <h4 className="text-[15px] font-bold  uppercase tracking-widest mb-3">Storage Guidelines</h4>
                      <p className="text-[11px] font-semibold leading-relaxed">{deepData.storage}</p>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-5 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="flex gap-2">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[8px] font-semibold text-amber-800 leading-normal uppercase">
                          Attention: Data for clinical identification only. Consult licensed medical professionals.
                        </p>
                      </div>
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