'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Calendar, MapPin, Phone, Shield,
  ShoppingBag, CreditCard, Heart, Star,
  Pencil, X, Camera, Save, Loader2, Globe
} from 'lucide-react';
import api from '@/lib/axios';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function StatCard({ icon, label, value, color }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-base-300/70 border border-slate-200/60 dark:border-base-300/50 p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-30 dark:opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500`} />
      <div className="relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-sm`}>
          {icon}
        </div>
        <p className="text-xs font-medium text-slate-500 dark:text-base-content/60 mt-3 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-base-content mt-1">{value ?? '—'}</p>
      </div>
    </motion.div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-4 rounded-xl bg-slate-50/80 dark:bg-base-300/40 border border-slate-100 dark:border-base-300/30">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 dark:text-base-content/50">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-base-content truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    phone: '',
    location: '',
    avatar: '',
  });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get('/auth/profile');
      if (data.success) {
        setProfile(data.user);
        setFormData({
          name: data.user.name || data.user.username || '',
          username: data.user.username || '',
          bio: data.user.bio || '',
          phone: data.user.phone || '',
          location: data.user.location || '',
          avatar: data.user.avatar || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Could not load profile data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, avatar: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await api.put('/auth/profile', {
        name: formData.name,
        username: formData.username,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        avatar: formData.avatar,
      });

      if (data.success) {
        setProfile((prev) => ({
          ...prev,
          name: formData.name,
          username: formData.username,
          bio: formData.bio,
          phone: formData.phone,
          location: formData.location,
          avatar: formData.avatar,
        }));

        if (updateUser) {
          updateUser({ name: formData.name, username: formData.username });
        }

        setEditOpen(false);
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const openEdit = () => {
    if (profile) {
      setFormData({
        name: profile.name || profile.username || '',
        username: profile.username || '',
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        avatar: profile.avatar || '',
      });
    }
    setEditOpen(true);
  };

  const displayName = profile?.name || profile?.username || authUser?.name || authUser?.username || 'User';
  const displayUsername = profile?.username || authUser?.username || '';
  const displayEmail = profile?.email || authUser?.email || '';
  const displayRole = profile?.role || authUser?.role || 'user';
  const displayBio = profile?.bio || '';
  const displayLocation = profile?.location || '';
  const displayPhone = profile?.phone || '';
  const displayAvatar = profile?.avatar || '';
  const stats = profile?.stats || {};
  const createdAt = profile?.createdAt || null;

  const avatarSrc = displayAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=6366f1&textColor=ffffff`;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white/70 dark:bg-base-300/50 animate-pulse h-48 border border-slate-200/60 dark:border-base-300/50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <p className="text-slate-600 dark:text-base-content/70 font-medium">{error}</p>
        <button
          type="button"
          onClick={fetchProfile}
          className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Profile Header Card */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative group shrink-0">
            <div className="w-28 h-28 rounded-full ring-4 ring-white/30 shadow-xl overflow-hidden bg-indigo-400">
              <img
                src={avatarSrc}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={openEdit}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white text-indigo-700 shadow-md flex items-center justify-center hover:bg-indigo-50 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-105"
              aria-label="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center sm:text-left min-w-0 flex-1 pt-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">{displayName}</h1>
            {displayUsername && (
              <p className="text-indigo-200 text-sm mt-0.5">@{displayUsername}</p>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 font-medium">
                <Mail className="w-3.5 h-3.5" />
                {displayEmail}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 font-medium capitalize">
                <Shield className="w-3.5 h-3.5" />
                {displayRole}
              </span>
              {createdAt && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={openEdit}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Total Orders"
          value={stats.totalOrders ?? 0}
          color="from-indigo-500/20 to-purple-500/20"
        />
        <StatCard
          icon={<CreditCard className="w-5 h-5" />}
          label="Total Purchases"
          value={stats.totalPurchases ?? 0}
          color="from-emerald-500/20 to-teal-500/20"
        />
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          label="Collection Items"
          value={stats.totalCollectionItems ?? 0}
          color="from-rose-500/20 to-pink-500/20"
        />
        <StatCard
          icon={<Star className="w-5 h-5" />}
          label="Favorite Category"
          value={stats.favoriteCategory || '—'}
          color="from-amber-500/20 to-orange-500/20"
        />
      </div>

      {/* Details Cards */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-white dark:bg-base-300/70 border border-slate-200/60 dark:border-base-300/50 p-6 sm:p-8 shadow-sm"
      >
        <h2 className="text-base font-semibold text-slate-800 dark:text-base-content mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow icon={<User className="w-4 h-4" />} label="Full Name" value={displayName} />
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={displayEmail} />
          <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={displayLocation} />
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={displayPhone} />
          <InfoRow icon={<Shield className="w-4 h-4" />} label="Role" value={displayRole} />
          <InfoRow
            icon={<Calendar className="w-4 h-4" />}
            label="Member Since"
            value={createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—'}
          />
        </div>
      </motion.div>

      {/* Bio Card */}
      {displayBio && (
        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-white dark:bg-base-300/70 border border-slate-200/60 dark:border-base-300/50 p-6 sm:p-8 shadow-sm"
        >
          <h2 className="text-base font-semibold text-slate-800 dark:text-base-content mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            Bio
          </h2>
          <p className="text-sm text-slate-600 dark:text-base-content/70 leading-relaxed">{displayBio}</p>
        </motion.div>
      )}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => !saving && setEditOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-base-200 shadow-2xl border border-slate-200 dark:border-base-300/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-base-300/50">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-base-content">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                  className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-base-300 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-base-content hover:bg-slate-200 dark:hover:bg-base-300/80 transition-colors disabled:opacity-40"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full ring-4 ring-indigo-100 dark:ring-indigo-500/20 overflow-hidden shadow-md bg-indigo-50 dark:bg-base-300">
                      <img
                        src={formData.avatar || avatarSrc}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-indigo-600 text-white shadow-md flex items-center justify-center hover:bg-indigo-700 transition-colors"
                      aria-label="Upload photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-base-content/50">Click the camera icon to change photo</p>
                </div>

                {/* Form Fields */}
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-base-content block mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-base-300 border border-slate-200 dark:border-base-300/50 rounded-xl text-sm text-slate-800 dark:text-base-content placeholder-slate-400 dark:placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-base-content block mb-1.5">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-base-300 border border-slate-200 dark:border-base-300/50 rounded-xl text-sm text-slate-800 dark:text-base-content placeholder-slate-400 dark:placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
                    placeholder="@username"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-base-content block mb-1.5">Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-base-300 border border-slate-200 dark:border-base-300/50 rounded-xl text-sm text-slate-800 dark:text-base-content placeholder-slate-400 dark:placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-base-content block mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-base-300 border border-slate-200 dark:border-base-300/50 rounded-xl text-sm text-slate-800 dark:text-base-content placeholder-slate-400 dark:placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-base-content block mb-1.5">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-base-300 border border-slate-200 dark:border-base-300/50 rounded-xl text-sm text-slate-800 dark:text-base-content placeholder-slate-400 dark:placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-200"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-slate-100 dark:border-base-300/50">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-base-content/70 bg-slate-100 dark:bg-base-300 hover:bg-slate-200 dark:hover:bg-base-300/80 rounded-xl transition-colors disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
