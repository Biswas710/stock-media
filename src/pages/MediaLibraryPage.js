import { useState, useEffect, useContext, useMemo } from 'react';
// For 3D preview
// You must install @google/model-viewer in your project for this to work
// import '@google/model-viewer';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import ProfileMenu from '../components/ProfileMenu';
import { colors, gradients } from '../theme/colors';
import axios from 'axios';

// 3D Viewer using model-viewer (requires @google/model-viewer)
function ThreeDViewer({ src, title }) {
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <model-viewer
        src={src}
        alt={title}
        camera-controls
        style={{ width: '100%', height: '200px', background: 'transparent' }}
        auto-rotate
        ar
        exposure="1"
      >
        <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>3D Preview Not Supported</div>
      </model-viewer>
    </div>
  );
}

export default function MediaLibraryPage() {
  const { user, logout, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  const [sortBy, setSortBy] = useState('recent');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('photos');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showGetStartedVideo, setShowGetStartedVideo] = useState(false);
  const [typeFilters, setTypeFilters] = useState({
    photos: true,
    illustration: false,
    video: false,
    pdf: false,
    infographics: false,
    music: false,
    '3d': false,
    ppt: false,
  });
  const [categoryFilters, setCategoryFilters] = useState({
    background: false,
    icon: false,
    people: false,
    objects: false,
    nature: false,
  });
  const [designerFilters, setDesignerFilters] = useState({
    ganesh: false,
    indu: false,
    nehal: false,
    sachin: false,
    mahesh: false,
    shubham: false,
    rahul: false,
  });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [downloads, setDownloads] = useState(() => {
    const saved = localStorage.getItem('downloads');
    return saved ? JSON.parse(saved) : [];
  });

  const R2_BASE_URL = "https://pub-ffeecb964df6439a9a2f21e12f093896.r2.dev";


  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('downloads', JSON.stringify(downloads));
  }, [downloads]);

  const fetchMedia = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadError('Please select a file');
      return;
    }

    setUploadLoading(true);
    setUploadError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('type', uploadType);

    try {
      await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setUploadSuccess('File uploaded successfully!');
      setUploadFile(null);
      setUploadType('photos');
      setTimeout(() => {
        setShowUploadModal(false);
        fetchMedia();
      }, 1500);
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  const toggleFavorite = (itemId) => {
    setFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleDownload = async (item) => {
    try {
      // Extract the file path from the URL
      const fileUrl = getSrc(item.url);
      
      // Fetch the file as a blob
      const response = await axios.get(fileUrl, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Create a blob URL and download
      const blob = new Blob([response.data]);
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Use the original filename with extension
      const filename = item.filename || item.title;
      link.download = filename || 'download';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      // Track the download
      if (!downloads.includes(item.id)) {
        setDownloads((prev) => [...prev, item.id]);
      }
      
      console.log(`✅ Download started: ${filename}`);
    } catch (error) {
      console.error('Download error:', error);
      alert(`Failed to download: ${error.message}`);
    }
  };

  const getSrc = (url) => {
  if (url.startsWith('http')) return url;
  return `${R2_BASE_URL}/${url}`;
};


  const filteredItems = useMemo(() => {
    let result = media;
    
    // Check if any type filters are selected
    const activeTypeFilters = Object.values(typeFilters).some(val => val === true);
    
    if (activeTypeFilters) {
      result = result.filter((item) => {
        const filterKey = item.type.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        return typeFilters[filterKey] === true;
      });
    }
    
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.type === activeCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((item) => {
        const titleMatch = item.title?.toLowerCase().includes(term);
        const extMatch = item.extension?.toLowerCase().includes(term);
        return titleMatch || extMatch;
      });
    }
    if (viewMode === 'favorites') {
      result = result.filter((item) => favorites.includes(item.id));
    } else if (viewMode === 'downloads') {
      result = result.filter((item) => downloads.includes(item.id));
    }
    return result;
  }, [media, typeFilters, activeCategory, searchTerm, viewMode, favorites, downloads]);

  const sortedItems = useMemo(() => {
    let copy = [...filteredItems];
    if (sortBy === 'name') {
      copy.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else {
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return copy;
  }, [filteredItems, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedItems.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedItems, currentPage]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTypeColor = (type) => {
    const typeColors = {
      photos: '#3b82f6',
      vectors: colors.primaryBlue,
      illustrations: '#f59e0b',
      videos: '#ef4444',
      music: '#ec4899',
      '3d': '#10b981',
      pdf: '#dc2626',
      ppt_template: '#7c3aed',
      infographics: '#06b6d4',
      ar_vr_assets: '#8b5cf6',
    };
    return typeColors[type] || '#6b7280';
  };

  const getMediaPreview = (item) => {
    const ext = item.extension?.toLowerCase() || '';
    // Video preview: mp4, webm, avi, mov
    if (item.type === 'videos' || ['.mp4', '.webm', '.avi', '.mov'].includes(ext)) {
      return (
        <video
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          controls
          preload="metadata"
        >
          <source src="https://pub-ffeecb964df6439a9a2f21e12f093896.r2.dev/uploads/getstarted_videos/getstarted_videos.mp4" />

        </video>
      );
    }
    // 3D preview: glb, gltf, obj, fbx, stl
    if (
      item.type === '3d' ||
      ['.glb', '.gltf', '.obj', '.fbx', '.stl'].includes(ext)
    ) {
      return <ThreeDViewer src={getSrc(item.url)} title={item.title} />;
    }
    // PDF preview
    if (item.type === 'pdf' || ext === '.pdf') {
      return (
        <embed
          src={getSrc(item.url)}
          type="application/pdf"
          width="100%"
          height="200px"
        />
      );
    }
    // PPT preview (icon only, as browser can't preview ppt)
    if (item.type === 'ppt_template' || ext === '.ppt' || ext === '.pptx') {
      return (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
          <div style={{ fontSize: '0.8rem' }}>PPT Template</div>
        </div>
      );
    }
    // Music preview
    if (item.type === 'music' || ['.mp3', '.wav', '.m4a'].includes(ext)) {
      return (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
          <audio controls preload="metadata" style={{ maxWidth: '100%' }}>
            <source src={getSrc(item.url)} type="audio/mpeg" />
          </audio>
        </div>
      );
    }
    // Image preview: jpg, jpeg, png, svg, gif, ai
    if (
      ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.ai'].includes(ext)
    ) {
      return (
        <img
          src={getSrc(item.url)}
          alt={item.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      );
    }
    // Blender preview (icon only)
    if (ext === '.blend') {
      return (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🧊</div>
          <div style={{ fontSize: '0.8rem' }}>Blender File</div>
        </div>
      );
    }
    // Fallback for unsupported types
    return (
      <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '1.2rem' }}>
        No preview available
      </div>
    );
  };

  const uploadAccept = useMemo(() => {
    const acceptMap = {
      'music': 'audio/*',
      'videos': 'video/*',
      '3d': '.glb,.gltf,.obj,.fbx,model/*',
      'pdf': '.pdf',
      'ppt_template': '.ppt,.pptx',
      'infographics': 'image/*',
      'photos': 'image/*',
      'vectors': 'image/*',
      'illustrations': 'image/*',
    };
    return acceptMap[uploadType] || '*/*';
  }, [uploadType]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Top Header */}
      <header
        style={{
          background: '#f7f7f8',
          borderBottom: '2px solid #bdbdbd',
          padding: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 120,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '1600px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', height: '100%' }}>
          {/* Title/Subtitle */}
          <div style={{ flex: '0 0 340px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', height: '100%', paddingLeft: '18px' }}>
            <span style={{ fontSize: '1.45rem', fontWeight: 700, color: '#181c4b', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: '0.1rem' }}>
              Testing Team
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 500, color: '#181c4b', opacity: 0.85, marginTop: '0.1rem' }}>
              Digital Asset Management (DAM)
            </span>
          </div>
          {/* Divider */}
          <div style={{ width: '1px', height: '60%', background: '#d1d5db', margin: '0 18px' }} />
          {/* Search Bar and Dropdown/Profile with spacing */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '100%' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7rem 2.5rem 0.7rem 1rem',
                  border: 'none',
                  borderRadius: '0.4rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  background: '#fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  outline: 'none',
                  height: '38px',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '0.9rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#181c4b',
                  fontSize: '1.5rem',
                  pointerEvents: 'none',
                  opacity: 0.85,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#181c4b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
            </div>
            <div style={{ width: '24px' }} />
            {/* Dropdown and Profile */}
            <div style={{ flex: '0 0 210px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.7rem', height: '100%', paddingRight: '18px' }}>
              <select
                value={viewMode}
                onChange={e => {
                  setViewMode(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '0.5rem 1.1rem',
                  border: 'none',
                  borderRadius: '0.3rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: '#fff',
                  color: '#181c4b',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '110px',
                  transition: 'box-shadow 0.2s',
                  height: '38px',
                }}
              >
                <option value="all">All Media</option>
                <option value="favorites">❤️ Favorites</option>
                <option value="downloads">⬇️ My Downloads</option>
              </select>
              <div style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <ProfileMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Secondary Header - Get Started & Pagination (Fixed) */}
      <div
        style={{
          background: '#e5e7eb',
          padding: '0.5rem 2rem',
          borderBottom: '1px solid #d1d5db',
          position: 'fixed',
          top: '64px',
          left: 0,
          width: '100%',
          zIndex: 110,
          minHeight: '48px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Get Started Button */}
          <button
            onClick={() => setShowGetStartedVideo(true)}
            style={{
              padding: '0.5rem 1.2rem',
              background: '#999',
              color: 'white',
              border: 'none',
              borderRadius: '0.3rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              minWidth: '120px',
            }}
          >
            Get Started
          </button>
          {/* Pagination - align left to prevent overflow */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', overflowX: 'auto', maxWidth: '520px', justifyContent: 'flex-end', marginRight: '0', paddingRight: '0.5rem' }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.4rem 0.9rem',
                background: currentPage === 1 ? '#bbb' : '#999',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                minWidth: '80px',
              }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                style={{
                  width: '32px',
                  height: '32px',
                  padding: 0,
                  background: num === currentPage ? '#333' : '#bbb',
                  color: num === currentPage ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  margin: '0 2px',
                }}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.4rem 0.9rem',
                background: currentPage === totalPages ? '#bbb' : '#999',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                minWidth: '80px',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: colors.white,
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Upload New Asset</h2>

            {uploadError && (
              <div
                style={{
                  background: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  padding: '1rem',
                  borderRadius: '0.25rem',
                  marginBottom: '1rem',
                }}
              >
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div
                style={{
                  background: '#dcfce7',
                  border: '1px solid #86efac',
                  color: '#166534',
                  padding: '1rem',
                  borderRadius: '0.25rem',
                  marginBottom: '1rem',
                }}
              >
                {uploadSuccess}
              </div>
            )}

            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Asset Type *
                </label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="photos">Photos</option>
                  <option value="vectors">Vectors</option>
                  <option value="illustrations">Illustrations</option>
                  <option value="videos">Videos</option>
                  <option value="music">Music</option>
                  <option value="3d">3D Assets</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Asset title (optional)"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  File *
                </label>
                <input
                  type="file"
                  accept={uploadAccept}
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError('');
                    setUploadSuccess('');
                    setUploadFile(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#f3f4f6',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: colors.primaryBlue,
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    opacity: uploadLoading ? 0.5 : 1,
                  }}
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Layout */}
      {/* Main Layout - add top margin for fixed headers */}
      <div style={{ display: 'flex', maxWidth: '1400px', margin: '0 auto', marginTop: '112px' }}>
        {/* Left Sidebar - Filters */}
        <aside
          style={{
            width: '280px',
            padding: '1.5rem 1rem',
            borderRight: '1px solid #e5e7eb',
            background: colors.white,
           
          }}
        >
          {/* Filter by Type */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              color: '#333', 
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: '#ddd',
              borderRadius: '0.25rem'
            }}>
              Filter by Type
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[...new Set(media.map(m => m.type))]
                .filter(type => {
                  const t = type.toLowerCase().replace(/\s+/g, '');
                  return t !== 'getstartedvideos' && t !== 'getstarted' && t !== '3dassets' && t !== '3d assets';
                })
                .sort()
                .map((type) => {
                  const displayNames = {
                    'photos': 'Photos',
                    'vectors': 'Vectors',
                    'illustrations': 'Illustrations',
                    'videos': 'Videos',
                    'music': 'Music',
                    '3d': '3D Assets',
                    'pdf': 'PDF',
                    'ppt_template': 'PPT Template',
                    'infographics': 'Infographics',
                    'ar_vr_assets': 'AR/VR Assets',
                  };
                  const label = displayNames[type] || type.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  return (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={typeFilters[type] || false}
                        onChange={(e) => setTypeFilters({ ...typeFilters, [type]: e.target.checked })}
                        style={{ cursor: 'pointer' }}
                      />
                      {label}
                    </label>
                  );
                })}
            </div>
          </div>

          {/* Filter by Category */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              color: '#333', 
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: '#ddd',
              borderRadius: '0.25rem'
            }}>
              Filter by Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { key: 'background', label: 'Background' },
                { key: 'icon', label: 'Icon' },
                { key: 'people', label: 'People' },
                { key: 'objects', label: 'Objects' },
                { key: 'nature', label: 'Nature' },
              ].map((cat) => (
                <label key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={categoryFilters[cat.key]}
                    onChange={(e) => setCategoryFilters({ ...categoryFilters, [cat.key]: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Designer */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '0.85rem', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              color: '#333', 
              marginBottom: '0.75rem',
              padding: '0.5rem',
              background: '#ddd',
              borderRadius: '0.25rem'
            }}>
              Filter by Designer
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { key: 'ganesh', label: 'Designer1' },
                { key: 'indu', label: 'Designer2' },
                { key: 'nehal', label: 'Designer3' },
                { key: 'sachin', label: 'Designer4' },
                { key: 'mahesh', label: 'Designer5' },
                { key: 'shubham', label: 'Designer6' },
                { key: 'rahul', label: 'Designer7' },
              ].map((designer) => (
                <label key={designer.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={designerFilters[designer.key]}
                    onChange={(e) => setDesignerFilters({ ...designerFilters, [designer.key]: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  {designer.label}
                </label>
              ))}
            </div>
          </div>

          {/* View */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', color: '#666', marginBottom: '0.75rem' }}>
              View
            </h3>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                fontSize: '0.9rem',
              }}
            >
              <option value="all">All Media</option>
              <option value="favorites">❤️ Favorites</option>
              <option value="downloads">⬇️ My Downloads</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', color: '#666', marginBottom: '0.75rem' }}>
              Sort By
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                fontSize: '0.9rem',
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </aside>

        {/* Main Content - Media Grid */}
        <main style={{ flex: 1, padding: '2rem 1rem', marginTop: '84px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ fontSize: '1.2rem' }}>⏳ Loading media...</p>
            </div>
          ) : paginatedItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', background: colors.white, borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '1.2rem', color: '#666' }}>
                {viewMode === 'favorites'
                  ? '❤️ No favorites yet'
                  : viewMode === 'downloads'
                  ? '⬇️ No downloads yet'
                  : '📭 No media found'}
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', color: '#666' }}>
                📊 Showing {paginatedItems.length} of {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} (Page {currentPage} of {totalPages})
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: colors.white,
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Media Preview */}
                    <div style={{ position: 'relative', background: '#000', height: '200px' }}>
                      {getMediaPreview(item)}
                      {/* Type Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          background: getTypeColor(item.type),
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          zIndex: 10,
                        }}
                      >
                        {item.type === '3d' ? '3D' : item.originalType || item.type}
                      </div>
                    </div>
                    {/* Media Info */}
                    <div style={{ padding: '0.75rem' }}>
                      <h3
                        style={{
                          margin: '0 0 0.25rem',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          color: '#333',
                        }}
                      >
                        {item.title}
                      </h3>
                      <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#666' }}>
                        {item.type}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                            setShowDetails(true);
                          }}
                          style={{
                            flex: 1,
                            padding: '0.4rem',
                            background: colors.primaryBlue,
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.opacity = '0.9';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                          }}
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          style={{
                            flex: 1,
                            padding: '0.4rem',
                            background: favorites.includes(item.id) ? '#ef4444' : '#e5e7eb',
                            color: favorites.includes(item.id) ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.opacity = '0.9';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                          }}
                        >
                          {favorites.includes(item.id) ? '❤️' : '🤍'} Like
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.4rem',
                          background: colors.white,
                          color: colors.primaryBlue,
                          border: `1px solid ${colors.primaryBlue}`,
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.85rem',
                        }}
                      >
                        ⬇️ Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Get Started Video Modal */}
      {showGetStartedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
          onClick={() => setShowGetStartedVideo(false)}
        >
          <div
            style={{
              background: colors.white,
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>Get Started</h2>
              <button
                onClick={() => setShowGetStartedVideo(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div
              style={{
                background: '#000',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                aspectRatio: '16/9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <video
                controls
                width="100%"
                height="100%"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              >
                <source src="https://pub-ffeecb964df6439a9a2f21e12f093896.r2.dev/uploads/getstarted_videos/getstarted_videos.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.95rem' }}>
              Welcome to Learning Solutions DAM! This video will guide you through the basics of using our digital asset management system.
            </p>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: colors.white,
              padding: '2rem',
              borderRadius: '0.5rem',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>{selectedItem.title}</h2>
              <button
                onClick={() => setShowDetails(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Main Preview */}
            <div
              style={{
                background: '#000',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getMediaPreview(selectedItem)}
            </div>

            {/* Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#666' }}>
                <strong>Type:</strong> {selectedItem.type}
              </p>
              {selectedItem.description && (
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>Description:</strong> {selectedItem.description}
                </p>
              )}
              {selectedItem.createdAt && (
                <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>Uploaded:</strong> {new Date(selectedItem.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleDownload(selectedItem)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: colors.primaryBlue,
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ⬇️ Download
              </button>
              <button
                onClick={() => toggleFavorite(selectedItem.id)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: favorites.includes(selectedItem.id) ? '#ef4444' : '#ddd',
                  color: favorites.includes(selectedItem.id) ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                {favorites.includes(selectedItem.id) ? '❤️' : '🤍'} Like
              </button>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#ddd',
                  color: '#333',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
