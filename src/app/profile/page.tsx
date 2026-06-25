"use client";

import { useState, useEffect } from "react";
import { useApp, getLevelInfo, achievementsList, Certificate } from "../../lib/db";
import { 
  Award, Flame, Calendar, BookOpen, Printer, 
  X, CheckCircle, ShieldCheck, Mail, ShieldAlert, AwardIcon,
  Upload as UploadIcon, Download, Database, Trash2, Loader2,
  File, Copy, ExternalLink, RefreshCw, Paperclip
} from "lucide-react";

export default function Profile() {
  const { user, courses, updateProfileName, updateProfilePhoto, saveProfile, resetProgress, loading } = useApp();
  
  // Profile name update states
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [updating, setUpdating] = useState(false);

  // Certificate Modal states
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  // Avatar upload states
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Cloud Storage states
  const [storageFiles, setStorageFiles] = useState<any[]>([]);
  const [fetchingFiles, setFetchingFiles] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fetchStorageFiles = async () => {
    if (!user) return;
    setFetchingFiles(true);
    setUploadError(null);
    try {
      const { ref, listAll, getDownloadURL, getMetadata } = await import("firebase/storage");
      const { storage } = await import("../../lib/firebase");
      if (storage) {
        const userFolderRef = ref(storage, `users/${user.uid}/files`);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Storage timeout")), 1500));
        const res: any = await Promise.race([listAll(userFolderRef), timeoutPromise]);
        
        const filesData = await Promise.all(
          res.items.map(async (itemRef) => {
            const [url, metadata] = await Promise.all([
              getDownloadURL(itemRef),
              getMetadata(itemRef)
            ]);
            return {
              name: itemRef.name,
              fullPath: itemRef.fullPath,
              size: metadata.size,
              contentType: metadata.contentType || "application/octet-stream",
              timeCreated: metadata.timeCreated,
              downloadURL: url
            };
          })
        );
        filesData.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
        setStorageFiles(filesData);
      }
    } catch (err) {
      // Silently fail if storage is unconfigured or times out to avoid console spam
    } finally {
      setFetchingFiles(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStorageFiles();
    }
  }, [user?.uid]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File must be smaller than 10MB.");
      return;
    }

    setUploadingFile(true);
    setUploadError(null);
    try {
      const { ref, uploadBytes } = await import("firebase/storage");
      const { storage } = await import("../../lib/firebase");
      if (storage) {
        const fileRef = ref(storage, `users/${user.uid}/files/${file.name}`);
        await uploadBytes(fileRef, file);
        await fetchStorageFiles();
      } else {
        throw new Error("Storage not configured.");
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      setUploadError(err?.message || "File upload failed.");
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDeleteFile = async (fileToDelete: any) => {
    if (!user) return;
    if (!confirm(`Are you sure you want to delete "${fileToDelete.name}"?`)) return;
    try {
      const { ref, deleteObject } = await import("firebase/storage");
      const { storage } = await import("../../lib/firebase");
      if (storage) {
        const fileRef = ref(storage, fileToDelete.fullPath);
        await deleteObject(fileRef);
        await fetchStorageFiles();
      }
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err?.message || "Failed to delete file.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Download URL copied to clipboard!");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Image must be smaller than 3MB.");
      return;
    }

    setUploadingPhoto(true);
    try {
      const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
      const { storage } = await import("../../lib/firebase");
      if (storage) {
        const storageRef = ref(storage, `avatars/${user?.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        await updateProfilePhoto(downloadURL);
      } else {
        throw new Error("Firebase storage is not configured.");
      }
    } catch (err) {
      console.error("Failed to upload image:", err);
      alert("Upload failed. Please check your storage configurations.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleExportProgress = () => {
    if (!user) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `learncode_progress_${user.uid}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportProgress = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        
        if (!importedData.uid || typeof importedData.xp !== "number" || !Array.isArray(importedData.enrolledCourses)) {
          alert("Invalid backup file structure.");
          return;
        }

        if (confirm(`Do you want to restore progress for "${importedData.name}"? This will overwrite your current progress.`)) {
          await saveProfile(importedData);
          alert("Progress restored successfully!");
          window.location.reload();
        }
      } catch (err) {
        console.error("Failed to parse imported file:", err);
        alert("Error reading file. Ensure it is a valid JSON document.");
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <span className="text-indigo-400 text-sm animate-pulse">Loading profile credentials...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="glass-panel-heavy p-8 text-center rounded-2xl max-w-md w-full shadow-xl">
          <AwardIcon className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Profile Session</h2>
          <p className="text-slate-400 text-sm mb-6">
            Please sign in to view your profile and manage your certifications.
          </p>
          <a
            href="/signin"
            className="inline-flex w-full justify-center rounded-xl btn-gradient px-4 py-3 text-sm shadow-lg shadow-indigo-500/15 cursor-pointer"
          >
            Sign In Now
          </a>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(user.xp);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === user.name) {
      setEditing(false);
      return;
    }

    setUpdating(true);
    try {
      await updateProfileName(newName.trim());
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 w-full space-y-8 no-print">
      
      {/* Page header title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Student Profile</h1>
        <p className="text-slate-400 text-sm">
          Manage your credentials, explore digital achievements, and view generated course certificates.
        </p>
      </div>

      {/* Grid: Profile editor and active statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Profile Card & Editor */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative group h-20 w-20 rounded-full overflow-hidden shadow-xl shadow-indigo-500/15 border-3 border-white bg-gradient-to-br from-indigo-400 via-violet-500 to-fuchsia-500">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-white select-none">
                {user.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
              </div>
            )}
            
            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity duration-300 rounded-full">
              <UploadIcon className="h-4.5 w-4.5" />
              <span className="text-[8px] font-bold mt-0.5 uppercase tracking-wide">Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadingPhoto}
              />
            </label>
            
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
              </div>
            )}
          </div>
          
          <div className="space-y-1 w-full">
            {editing ? (
              <form onSubmit={handleUpdateName} className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="glass-input px-3 py-1.5 text-xs w-full text-center"
                  placeholder="Change Name"
                  disabled={updating}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded-lg bg-indigo-500 px-3 py-1.5 text-3xs font-bold text-white transition-all hover:bg-indigo-600 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-3xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
                <button 
                  onClick={() => { setNewName(user.name); setEditing(true); }}
                  className="text-3xs font-bold text-indigo-500 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>

          <div className="w-full border-t border-indigo-100/50 pt-4 flex justify-around text-center">
            <div>
              <span className="text-3xs font-semibold text-slate-400 block uppercase">Role</span>
              <span className="text-xs font-bold text-indigo-500 capitalize">{user.role}</span>
            </div>
            <div>
              <span className="text-3xs font-semibold text-slate-400 block uppercase">Level</span>
              <span className="text-xs font-bold text-slate-800">{levelInfo.level}</span>
            </div>
            <div>
              <span className="text-3xs font-semibold text-slate-400 block uppercase">Streak</span>
              <span className="text-xs font-bold text-orange-500 flex items-center gap-0.5 justify-center">
                <Flame className="h-3.5 w-3.5 fill-orange-500" /> {user.streak}d
              </span>
            </div>
          </div>
        </div>

        {/* Level details & XP stats */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-indigo-500" />
              XP Progression & Level Limits
            </h3>
            <p className="text-xs text-slate-400">
              Each course lesson complete awards between 100-220 XP. Completing lesson quizzes yields an additional 50 XP. Level thresholds scale at 500 XP intervals.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-600">Level {levelInfo.level} Progress</span>
              <span className="text-slate-500">{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP</span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-indigo-100 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-500"
                style={{ width: `${levelInfo.progressPercentage}%` }}
              />
            </div>
            <span className="text-3xs text-slate-400 block">
              Cumulative XP: {user.xp} points. You need {levelInfo.xpNeededForNextLevel - levelInfo.xpInCurrentLevel} more XP to reach level {levelInfo.level + 1}.
            </span>
          </div>
        </div>

      </div>

      {/* Grid: Achievements grid & Certificates list */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Achievements Card */}
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5 border-b border-indigo-100/50 pb-2">
            <Award className="h-5 w-5 text-amber-500" />
            Digital Badges & Achievements
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {achievementsList.map((ach) => {
              const isUnlocked = user.achievements.includes(ach.id);
              return (
                <div 
                  key={ach.id}
                  className={`p-3.5 rounded-xl border flex gap-3.5 items-start transition-all ${
                    isUnlocked 
                      ? "bg-amber-50/80 border-amber-200/50 text-slate-700 shadow-sm" 
                      : "bg-slate-50/50 border-slate-200/30 text-slate-300 opacity-50"
                  }`}
                >
                  <div className={`rounded-xl p-2.5 border shrink-0 ${
                    isUnlocked ? "bg-amber-100 border-amber-200/50 text-amber-500" : "bg-slate-100 border-slate-200/30 text-slate-300"
                  }`}>
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-800">{ach.title}</h4>
                      {isUnlocked && (
                        <span className="text-4xs font-bold text-emerald-500 uppercase">Unlocked ✓</span>
                      )}
                    </div>
                    <p className="text-3xs text-slate-400 leading-relaxed">{ach.description}</p>
                    <span className="text-3xs font-semibold text-amber-500 block">+{ach.xpReward} XP Reward</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificates Portal list */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5 border-b border-indigo-100/50 pb-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Issued Certificates
            </h3>

            {user.certificates.length === 0 ? (
              <div className="text-center p-8">
                <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  No certificates generated yet. Complete all lessons and quizzes of any course to issue a credential.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {user.certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => setActiveCert(cert)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/50 hover:bg-emerald-100/80 transition-all text-left cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{cert.courseName}</span>
                      <span className="text-3xs text-slate-400">Hash: {cert.id}</span>
                    </div>
                    <Printer className="h-4 w-4 text-emerald-500" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-3xs text-slate-400 leading-normal border-t border-indigo-100/40 pt-3">
            Certificates generated utilize a SHA-256 verifiable hash algorithm linked to your student credentials.
          </div>
        </div>

      </div>

      {/* Storage & Data Settings Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5 border-b border-indigo-100/50 pb-2">
          <Database className="h-5 w-5 text-indigo-500" />
          Storage & Data Settings
        </h3>

        <div className="grid gap-6 md:grid-cols-3 text-left">

          {/* Export/Import Backup */}
          <div className="bg-white/60 p-4 rounded-xl border border-indigo-100/50 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Backup & Restore</span>
              <p className="text-2xs text-slate-400 leading-relaxed">
                Export your current accomplishments as a JSON document or restore from an existing backup file.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleExportProgress}
                className="flex items-center gap-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 text-3xs font-bold px-3 py-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Download className="h-3.5 w-3.5" /> Export JSON
              </button>
              
              <label className="flex items-center gap-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 text-3xs font-bold px-3 py-1.5 transition-all cursor-pointer shadow-sm">
                <UploadIcon className="h-3.5 w-3.5" /> Import JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportProgress}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white/60 p-4 rounded-xl border border-rose-200/40 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-rose-500 uppercase tracking-wider block">Danger Zone</span>
              <p className="text-2xs text-slate-400 leading-relaxed">
                Wiping data will clear your local achievements, completed lessons, certificates, and XP logs.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to reset all progress, XP, and certificates? This action is irreversible.")) {
                    resetProgress();
                  }
                }}
                className="flex items-center gap-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200/50 text-rose-500 text-3xs font-bold px-3 py-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" /> Reset Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Storage Explorer Card */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-indigo-100/50 pb-3 gap-3">
          <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
            <Database className="h-5 w-5 text-indigo-500" />
            Cloud Storage Explorer
          </h3>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStorageFiles}
              disabled={fetchingFiles}
              className="flex items-center gap-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-600 text-3xs font-bold px-3 py-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              title="Refresh Files List"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${fetchingFiles ? "animate-spin" : ""}`} /> Refresh
            </button>
            
            <label className="flex items-center gap-1 rounded-lg btn-gradient px-3.5 py-1.5 text-3xs shadow-md shadow-indigo-500/10 cursor-pointer">
              <UploadIcon className="h-3.5 w-3.5" /> Upload File
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploadingFile}
              />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="rounded-xl border border-rose-200/50 bg-rose-50 p-3 text-xs text-rose-500 font-semibold">
            {uploadError}
          </div>
        )}

        {uploadingFile && (
          <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200/50 rounded-xl">
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
            <span className="text-xs text-indigo-600 font-bold">Uploading file to storage bucket...</span>
          </div>
        )}

        {fetchingFiles ? (
          <div className="text-center py-10">
            <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Scanning Cloud Storage registry...</p>
          </div>
        ) : storageFiles.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-indigo-100/60 rounded-2xl">
            <Paperclip className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400 leading-normal">
              No files found in your personal storage folder.
              <br />
              <span className="text-slate-300 text-[10px]">Upload assignments, notes, or project directories up to 10MB.</span>
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-indigo-100/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="pb-3 pl-2">Name</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Uploaded</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-50/80">
                {storageFiles.map((file, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="py-3 pl-2 font-semibold text-slate-800 max-w-[200px] truncate" title={file.name}>
                      <span className="flex items-center gap-2">
                        <File className="h-4 w-4 text-indigo-400 shrink-0" />
                        {file.name}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 truncate max-w-[120px]" title={file.contentType}>
                      {file.contentType.split("/")[1] || file.contentType}
                    </td>
                    <td className="py-3 text-slate-400">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(file.timeCreated).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                    <td className="py-3 text-right pr-2">
                      <div className="inline-flex gap-2.5">
                        <button
                          onClick={() => handleCopyUrl(file.downloadURL)}
                          className="p-1 text-slate-300 hover:text-indigo-500 transition-colors cursor-pointer"
                          title="Copy download URL"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        
                        <a
                          href={file.downloadURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="View / Download"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>

                        <button
                          onClick={() => handleDeleteFile(file)}
                          className="p-1 text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete file"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= PRINTABLE CERTIFICATE MODAL INTERFACE ================= */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto no-print">
          <div className="relative max-w-4xl w-full bg-white border border-indigo-100 rounded-3xl p-6 md:p-10 space-y-6 shadow-2xl">
            
            {/* Modal Controls Banner (no-print) */}
            <div className="flex justify-between items-center border-b border-indigo-100/50 pb-4">
              <span className="text-xs font-bold text-slate-400">Verifiable Student Credential</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 btn-gradient text-xs px-4 py-2 rounded-lg cursor-pointer"
                >
                  <Printer className="h-4 w-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setActiveCert(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* ================= ACTUAL PHYSICAL CERTIFICATE SHEET FOR PRINT ================= */}
            {/* This block is formatted separately and fits standard letter sizes when printing */}
            <div className="print-certificate bg-white border-[14px] border-double border-indigo-900 text-slate-900 p-8 md:p-16 text-center space-y-8 relative overflow-hidden rounded-xl shadow-2xl flex flex-col justify-between min-h-[500px]">
              
              {/* Subtle watermarks and designs */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100/50 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100/50 rounded-tr-full" />
              
              {/* School branding */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-indigo-900 font-extrabold text-xl tracking-tight uppercase">
                  <span>LearnCode Academy</span>
                </div>
                <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-widest block">
                  Interactive Programming Institute
                </span>
              </div>

              {/* Central Certifier headers */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-900 block border-b border-slate-200 pb-1.5 max-w-[280px] mx-auto">
                  Certificate of Graduation
                </span>
                
                <p className="text-xs italic text-slate-500">This is proudly presented to</p>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 border-b-2 border-slate-900/10 pb-2 max-w-md mx-auto">
                  {activeCert.studentName}
                </h2>
                
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  who has successfully completed the curriculum, code execution sandboxes, and quiz modules required to graduate from the course:
                </p>
                
                <h3 className="text-xl md:text-2xl font-black text-indigo-900 tracking-wide">
                  {activeCert.courseName}
                </h3>
              </div>

              {/* Footer signatures and unique cryptographic verification hashes */}
              <div className="grid grid-cols-3 items-end gap-4 border-t border-slate-200 pt-8">
                {/* Date */}
                <div className="text-left text-3xs space-y-1">
                  <span className="text-slate-400 block font-bold uppercase">Date Issued</span>
                  <span className="font-extrabold text-slate-800">{activeCert.date}</span>
                </div>

                {/* Seal */}
                <div className="flex justify-center relative">
                  <div className="h-16 w-16 rounded-full border-4 border-double border-indigo-900 flex items-center justify-center font-black text-[9px] uppercase tracking-tighter text-indigo-900 select-none bg-indigo-50 shadow-inner">
                    Verified
                  </div>
                </div>

                {/* Signatures */}
                <div className="text-right text-3xs space-y-1">
                  <span className="text-slate-400 block font-bold uppercase">Academic Dean</span>
                  <span className="font-semibold text-slate-800 font-mono italic">Adnan Rahoof</span>
                </div>
              </div>

              <div className="text-center text-4xs font-semibold font-mono text-slate-400 mt-4 leading-none">
                VERIFICATION HASH: {activeCert.hash.toUpperCase()} &bull; ID: {activeCert.id}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
