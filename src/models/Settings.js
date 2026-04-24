import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  pharmacyName: {
    type: String,
    default: 'PharmaEase',
  },
  supportEmail: {
    type: String,
    default: 'support@pharmaease.com',
  },
  easyPaisaNumber: {
    type: String,
    default: '0319 580 36 89',
  },
  jazzCashNumber: {
    type: String,
    default: '03719044201',
  },
  timezone: {
    type: String,
    default: 'GMT+05:00 (Karachi)',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
