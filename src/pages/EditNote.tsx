import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../components/rich-text-editor";
import { X } from "lucide-react";
import {Toaster, toast} from 'sonner'


export default function EditNote() {
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { title, content, tags, summary } = res.data;
        setTitle(title);
        setPost(content);
        setTags(tags || []);
        setSummary(summary || "");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load note");
      }
    };
    fetchNote();
  }, [id]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onChange = (content: string) => {
    setPost(content);
  };

  const handleSummarize = async () => {
    if (!post.trim()) {
      toast.error("Please enter some content first.");
      return;
    }

    setLoadingSummary(true);
    try {
      const summaryResponse = await axios.post("https://ai-textcraft.onrender.com/text/consize", {
        info: post,
        length: "15",
        blockedWord: "Beta",
      });

      const summaryText = summaryResponse.data.content;
      if (!summaryText) throw new Error("No summary returned from API");

      setSummary(summaryText);

      const tagsResponse = await axios.post("https://ai-textcraft.onrender.com/text/tags", {
        info: summaryText,
        length: 5,
      });

      const newTags = tagsResponse.data.tags || [];
      const uniqueTags = Array.from(new Set([...tags, ...newTags]));
      setTags(uniqueTags);
    } catch (err) {
      console.error(err);
      toast.error("Failed to summarize and generate tags.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("Not authenticated");

    if (!title.trim()) return toast.error("Title is required");
    if (!post.trim()) return toast.error("Content cannot be empty");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
        { title, content: post, summary, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Note updated!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update note");
    }
  };

  return (
    <>
    <Toaster richColors />
      <header className="p-6 flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Note</h1>
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

      <div className="max-w-3xl mx-auto p-4">
        <input
          type="text"
          placeholder="Note Title"
          className="w-full p-2 border rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="rounded mb-4 min-h-[200px] relative">
          <RichTextEditor content={post} onChange={onChange} />
        </div>

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleSummarize}
            disabled={loadingSummary}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loadingSummary ? "Summarizing..." : "Summarize"}
          </button>
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update Note
          </button>
        </div>

        {summary && (
          <div className="mb-4 p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <p>{summary}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white mb-4">
            {tags.map((tag, index) => (
              <span key={index} className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                {tag}
                <button type="button" onClick={() => removeTag(index)} className="ml-1 text-blue-500 hover:text-blue-700">
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type and press Enter"
              className="flex-1 outline-none px-2 py-1 min-w-[120px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}
