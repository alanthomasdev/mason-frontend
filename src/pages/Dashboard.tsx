// src/pages/Dashboard.tsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { Edit, Trash2 } from "lucide-react";
import {Toaster, toast} from 'sonner'
import Onboarding from "./Onboarding";



// --- Custom debounce function ---
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  summary: string;
}



export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const navigate = useNavigate();

  const fetchNotes = async (searchQuery = "", pageNum = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/search`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          q: searchQuery,
          page: pageNum,
          limit: 6,
        },
      });

      setNotes(res.data.notes);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notes.");
      // alert("Failed to load notes.");
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        fetchNotes(query, 1);
        setPage(1);
      }, 400),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    const isFirstLogin = localStorage.getItem("firstLogin") === "true";
    if (isFirstLogin) {
      setOnboardingVisible(true);
    } else {
      fetchNotes(search, page);
    }
  }, [page]);

  const deleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      if (window.confirm("Are you sure you want to delete this note?")) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchNotes(search, page);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note.");
      // alert("Failed to delete note.");
    }
  };

  function cleanHtml(html: string): string {
    return DOMPurify.sanitize(html, {
      FORBID_ATTR: ["style", "class"],
      ALLOWED_TAGS: ["p", "br", "h1", "h2", "h3", "h4", "h5", "h6", "mark", "strong", "em", "ul", "ol", "li", "blockquote"],
      ALLOWED_ATTR: ["href", "src", "alt"],
    });
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = 3;
    const startPage = Math.max(1, page - 1);
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} className={`px-3 py-1 rounded ${i === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"}`} onClick={() => setPage(i)}>
          {i}
        </button>
      );
    }

    return (
      <div className="flex gap-2 justify-center mt-6">
        <button disabled={page === 1} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        {pages}
        <button disabled={page === totalPages} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster richColors />
      {onboardingVisible ? (
        <Onboarding
          onClose={() => {
            setOnboardingVisible(false);
            localStorage.setItem("firstLogin", "false");
            fetchNotes(search, page);
          }}
        />
      ) : (
        <div>
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </header>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <input type="text" placeholder="Search notes..." value={search} onChange={handleSearchChange} className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/2" />
            <button onClick={() => navigate("/add")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Add Note
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No notes found.</p>
            ) : (
              notes.map((note) => (
                <div key={note._id} className="bg-white p-4 rounded-[10px] shadow hover:shadow-md transition-shadow relative group">
                  <div className="flex gap-2 items-end justify-end mb-4">
                    <button onClick={() => navigate(`/edit/${note._id}`)} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteNote(note._id)} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <h2 className="text-xl font-semibold mb-2 pr-8">{note.title}</h2>
                  <div className="whitespace-pre-wrap max-h-100 mb-6 overflow-hidden group-hover:overflow-y-auto pr-1" dangerouslySetInnerHTML={{ __html: cleanHtml(note.content) }} />
                  {
                  note.summary.length>0 ? (
                                      <h4 className="text-l my-2 pr-8 mb-6 bg-gray-100 rounded px-2 py-1">{note.summary}</h4>

                  ):""
                }
                  <p className="my-3 absolute bottom-0 text-sm text-gray-400 mt-2">{new Date(note.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>

          {renderPagination()}
        </div>
      )}
    </div>
  );
}
