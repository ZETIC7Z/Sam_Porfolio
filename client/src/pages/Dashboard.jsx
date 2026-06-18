import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Upload,
  Trash2,
  RefreshCw,
  GripVertical,
  Pencil,
  Plus,
  X,
  FileText,
  ExternalLink,
  LogOut,
  Save,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Tag,
  Github,
  Link as LinkIcon,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const accentColorOptions = [
  { value: "from-cyan-500 to-blue-600", label: "Cyan to Blue" },
  { value: "from-red-500 to-rose-600", label: "Red to Rose" },
  { value: "from-fuchsia-500 to-purple-600", label: "Fuchsia to Purple" },
  { value: "from-slate-500 to-gray-600", label: "Slate to Gray" },
  { value: "from-lime-500 to-green-600", label: "Lime to Green" },
  { value: "from-amber-500 to-orange-600", label: "Amber to Orange" },
  { value: "from-emerald-500 to-teal-600", label: "Emerald to Teal" },
  { value: "from-pink-500 to-rose-500", label: "Pink to Rose" },
];

const statusOptions = ["Live", "In Progress", "Coming Soon", "Archived"];

const ALL_CATEGORIES = [
  "Community Platforms", "Corporate & Agency", "Directories & Listings",
  "Documentation & Wikis", "E-Commerce Stores", "E-Learning & Courses",
  "Enterprise Dashboards", "Events & Meetups", "Forums & Niche Clubs",
  "Gaming & eSports", "Music & Audio", "News & Publishing",
  "Non-Profit & Welfare", "Progressive Web Apps (PWA)", "Real Estate & Property",
  "SaaS & Software", "Single Page Applications (SPA)", "Static Sites & Landing Pages",
  "Video & Streaming", "Visual Arts & Design",
];

/* Sortable Project Item */
const SortableProjectItem = ({ project, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
    >
      {/* Always-visible header row */}
      <div className="flex items-center gap-3 p-4">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <img
          src={project.image}
          alt={project.title}
          className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate pr-2">
            {project.title}
          </h4>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {(project.categories || [project.category]).slice(0, 3).map((cat, i) => (
              <span key={i} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Status + featured badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium">
              <CheckSquare className="w-3 h-3" /> Featured
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            {project.status}
          </span>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors flex-shrink-0"
          title={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* Edit + Delete */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(project)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-muted-foreground hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border bg-muted/20">
          {project.description && (
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-background border border-border text-xs text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              {project.highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-xs"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Live Demo <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-foreground hover:text-primary transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Accent color swatch */}
          {project.accentColor && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Accent:</span>
              <div
                className="w-5 h-5 rounded border border-border"
                style={{
                  background: `linear-gradient(135deg, ${project.accentColor.replace('from-', '').split(' to-')[0].replace('-500', '').replace('-', '/')}, ${project.accentColor.replace('from-', '').split(' to-')[1].replace('-500', '').replace('-', '/')})`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* Project Form */
const ProjectForm = ({ initialData, onSave, onCancel, apiBase = '' }) => {
  const [form, setForm] = useState({
    id: initialData?.id || null,
    title: initialData?.title || "",
    categories: Array.isArray(initialData?.categories) ? initialData.categories : (initialData?.category ? [initialData.category] : []),
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    tags: initialData?.tags?.join(", ") || "",
    demoUrl: initialData?.demoUrl || "",
    githubUrl: initialData?.githubUrl || "",
    featured: initialData?.featured || false,
    accentColor: initialData?.accentColor || accentColorOptions[0].value,
    status: initialData?.status || statusOptions[0],
    highlights: initialData?.highlights?.join(", ") || "",
  });
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [analyzeError, setAnalyzeError] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (cat) => {
    setForm((prev) => {
      const current = prev.categories || [];
      if (current.includes(cat)) {
        return { ...prev, categories: current.filter((c) => c !== cat) };
      }
      if (current.length >= 3) return prev;
      return { ...prev, categories: [...current, cat] };
    });
  };

  const handleAnalyze = async () => {
    if (!form.githubUrl) return;
    setAnalyzing(true);
    setAnalyzeError('');
    try {
      const endpoint = `${apiBase}/api/github-analyze`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: form.githubUrl }),
      });
      if (!res.ok) {
        const errText = await res.text();
        setAnalyzeError(`Analyze failed (${res.status}): ${errText.slice(0, 120)}`);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setForm(prev => ({
          ...prev,
          title: json.data.title || prev.title,
          categories: Array.isArray(json.data.categories) ? json.data.categories : (json.data.category ? [json.data.category] : prev.categories),
          shortDescription: json.data.shortDescription || prev.shortDescription,
          description: json.data.description || prev.description,
          tags: Array.isArray(json.data.tags) ? json.data.tags.join(', ') : prev.tags,
          highlights: Array.isArray(json.data.highlights) ? json.data.highlights.join(', ') : prev.highlights,
          demoUrl: json.data.demoUrl || prev.demoUrl,
          githubUrl: json.data.githubUrl || prev.githubUrl,
        }));
      } else {
        setAnalyzeError(json.error || 'Analyze returned no data.');
      }
    } catch (e) {
      console.error('Autofill error:', e);
      setAnalyzeError(`Network error: ${e.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
  };

  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1];
        try {
          const res = await fetch(`${apiBase}/api/upload`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              data: base64,
              prefix: "projects/images/",
            }),
          });
          const data = await res.json();
          resolve(data.file?.url || data.url || "");
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = form.image;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch {
        setUploading(false);
        return;
      }
    }

    const payload = {
      ...form,
      image: imageUrl,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      highlights: form.highlights.split(",").map((t) => t.trim()).filter(Boolean),
    };

    await onSave(payload);
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">GitHub URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={form.githubUrl}
            onChange={(e) => handleChange('githubUrl', e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !form.githubUrl}
            className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {analyzing && <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {analyzing ? 'Analyzing...' : 'Auto-fill'}
          </button>
        </div>
        {analyzeError && (
          <p className="mt-1 text-xs text-red-500">{analyzeError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Categories (max 3)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(form.categories || []).map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {cat}
                <button type="button" onClick={() => toggleCategory(cat)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mb-2">{(form.categories || []).length}/3 selected</p>
          <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-2 space-y-1">
            {ALL_CATEGORIES.map((cat) => (
              <label key={cat} className={cn("flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm", (form.categories || []).includes(cat) && "text-primary font-medium")}>
                <input
                  type="checkbox"
                  checked={(form.categories || []).includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="rounded border-border"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Image</label>
          {form.image && !imageFile && (
            <div className="flex items-center gap-2 mb-2">
              <img src={form.image} alt="" className="w-10 h-10 rounded object-cover border border-border" />
              <span className="text-xs text-muted-foreground truncate">{form.image}</span>
            </div>
          )}
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={handleImageFile}
            className="w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:font-medium hover:file:bg-primary/90"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Accent Color</label>
          <select
            value={form.accentColor}
            onChange={(e) => handleChange("accentColor", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {accentColorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Demo URL</label>
          <input
            type="url"
            value={form.demoUrl}
            onChange={(e) => handleChange("demoUrl", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="React, Node.js, Tailwind"
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Highlights (comma-separated)</label>
        <input
          type="text"
          value={form.highlights}
          onChange={(e) => handleChange("highlights", e.target.value)}
          placeholder="Feature A, Feature B, Feature C"
          className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="featured"
          type="checkbox"
          checked={form.featured}
          onChange={(e) => handleChange("featured", e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50"
        />
        <label htmlFor="featured" className="text-sm text-foreground">
          Featured project
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {uploading ? "Saving..." : "Save Project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
};

/* Dashboard Page */
export function Dashboard() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const [cv, setCv] = useState(null);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState("");
  const [cvSuccess, setCvSuccess] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [editingProject, setEditingProject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pendingReorder, setPendingReorder] = useState(null);

  const [cvSectionOpen, setCvSectionOpen] = useState(true);
  const [projectsSectionOpen, setProjectsSectionOpen] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const token = localStorage.getItem("admin_token");

  const fetchAuth = useCallback(
    (url, opts = {}) => {
      return fetch(url, {
        ...opts,
        headers: {
          ...(opts.headers || {}),
          Authorization: `Bearer ${token}`,
          "Content-Type": opts.headers?.["Content-Type"] || "application/json",
        },
      });
    },
    [token]
  );

  /* CV */
  const fetchCv = useCallback(async () => {
    setCvLoading(true);
    try {
      const res = await fetchAuth(`${API_BASE}/api/cv`);
      if (res.ok) {
        const data = await res.json();
        setCv(data.cv || data || null);
      } else {
        setCv(null);
      }
    } catch {
      setCv(null);
    } finally {
      setCvLoading(false);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchCv();
  }, [fetchCv]);

  const handleCvDelete = async () => {
    if (!cv) return;
    setCvLoading(true);
    try {
      await fetchAuth(`${API_BASE}/api/cv-delete`, {
        method: "POST",
        body: JSON.stringify({ pathname: cv.pathname || cv.url || cv }),
      });
      setCvSuccess("CV deleted successfully");
      fetchCv();
    } catch {
      setCvError("Failed to delete CV");
    } finally {
      setCvLoading(false);
      setTimeout(() => {
        setCvSuccess("");
        setCvError("");
      }, 3000);
    }
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCvUploading(true);
    setCvError("");
    setCvSuccess("");

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result.split(",")[1];
      try {
        const res = await fetchAuth(`${API_BASE}/api/upload`, {
          method: "POST",
          body: JSON.stringify({
            filename: file.name,
            data: base64,
            prefix: "cv/",
          }),
        });
        if (res.ok) {
          setCvSuccess("CV uploaded successfully");
          fetchCv();
        } else {
          setCvError("Failed to upload CV");
        }
      } catch {
        setCvError("Failed to upload CV");
      } finally {
        setCvUploading(false);
        setTimeout(() => {
          setCvSuccess("");
          setCvError("");
        }, 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  /* Projects */
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetchAuth(`${API_BASE}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : data.projects || []);
      }
    } catch {
      // ignore
    } finally {
      setProjectsLoading(false);
    }
  }, [fetchAuth]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);
    setPendingReorder(reordered);
  };

  const handleSaveReorder = async () => {
    if (!pendingReorder) return;
    try {
      await fetchAuth(`${API_BASE}/api/projects`, {
        method: "PUT",
        body: JSON.stringify({ projects: pendingReorder }),
      });
    } catch {
      // ignore
    }
    setPendingReorder(null);
  };

  const handleCancelReorder = () => {
    setPendingReorder(null);
    fetchProjects();
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`Are you sure you want to delete "${project.title}"?`)) return;
    try {
      await fetchAuth(`${API_BASE}/api/projects`, {
        method: "DELETE",
        body: JSON.stringify({ id: project.id }),
      });
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      fetchProjects();
    } catch {
      // ignore
    }
  };

  const handleSaveProject = async (payload) => {
    try {
      if (editingProject) {
        // Edit existing project - replace its fields in the array and PUT
        const updated = projects.map((p) =>
          p.id === editingProject.id ? { ...p, ...payload } : p
        );
        await fetchAuth(`${API_BASE}/api/projects`, {
          method: "PUT",
          body: JSON.stringify({ projects: updated }),
        });
      } else {
        // New project - POST as before
        const res = await fetchAuth(`${API_BASE}/api/projects`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.project) {
            setProjects((prev) => [...prev, data.project]);
          }
        }
      }
      setShowAddForm(false);
      setEditingProject(null);
      fetchProjects();
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin");
  };

  const cvFilename = cv
    ? typeof cv === "string"
      ? cv.split("/").pop()
      : cv.filename || cv.pathname?.split("/").pop() || "CV"
    : null;

  const cvUrl =
    typeof cv === "string" ? cv : cv?.url || cv?.pathname || "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Site
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* CV Management */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setCvSectionOpen(!cvSectionOpen)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">CV Management</h2>
            </div>
            {cvSectionOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {cvSectionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2">
                  {cvLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </div>
                  ) : cv ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{cvFilename}</p>
                          <a
                            href={cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary inline-flex items-center gap-1 hover:underline"
                          >
                            Preview <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleCvDelete}
                          disabled={cvLoading}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20 text-sm font-medium hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete CV
                        </button>
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer">
                          <Upload className="w-4 h-4" />
                          Replace CV
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleCvUpload}
                            className="hidden"
                            disabled={cvUploading}
                          />
                        </label>
                      </div>

                      {cvUploading && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Uploading...
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground text-sm">No CV uploaded</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload CV
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleCvUpload}
                          className="hidden"
                          disabled={cvUploading}
                        />
                      </label>
                      {cvUploading && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Uploading...
                        </p>
                      )}
                    </div>
                  )}

                  {cvSuccess && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-sm text-emerald-600"
                    >
                      {cvSuccess}
                    </motion.p>
                  )}
                  {cvError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-sm text-red-500"
                    >
                      {cvError}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Project Management */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <button
            onClick={() => setProjectsSectionOpen(!projectsSectionOpen)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Project Management</h2>
            </div>
            {projectsSectionOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {projectsSectionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2 space-y-6">
                  {/* Add New */}
                  {!showAddForm && !editingProject && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Project
                    </button>
                  )}

                  <AnimatePresence>
                    {(showAddForm || editingProject) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-muted/40 border border-border rounded-xl p-5">
                          <h3 className="text-sm font-semibold text-foreground mb-4">
                            {editingProject ? "Edit Project" : "New Project"}
                          </h3>
                          <ProjectForm
                            initialData={editingProject}
                            onSave={handleSaveProject}
                            apiBase={API_BASE}
                            onCancel={() => {
                              setShowAddForm(false);
                              setEditingProject(null);
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Project List */}
                  {projectsLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading projects...
                    </div>
                  ) : (
                    <>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={projects.map((p) => p.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                              {projects.map((project) => (
                                <motion.div
                                  key={project.id}
                                  layout
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <SortableProjectItem
                                    project={project}
                                    onEdit={(p) => {
                                      setShowAddForm(false);
                                      setEditingProject(p);
                                    }}
                                    onDelete={handleDeleteProject}
                                  />
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            {projects.length === 0 && (
                              <p className="text-muted-foreground text-sm text-center py-8">
                                No projects yet. Add your first project above.
                              </p>
                            )}
                          </div>
                        </SortableContext>
                      </DndContext>

                      {/* Pending reorder confirmation bar */}
                      {pendingReorder && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-3 bg-card border border-border rounded-2xl shadow-2xl backdrop-blur-sm">
                          <p className="text-sm text-foreground font-medium whitespace-nowrap">
                            You have unsaved order changes
                          </p>
                          <button
                            onClick={handleSaveReorder}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelReorder}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;