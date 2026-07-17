import React, { useState, useEffect } from 'react';
import axios from 'axios';

let API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
if (API_BASE && !API_BASE.endsWith('/api')) {
  API_BASE = `${API_BASE}/api`;
}

function App() {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [members, setMembers] = useState([]);
  const [activeView, setActiveView] = useState('boards'); // 'boards' or 'board'

  // Create form states
  const [newBoardName, setNewBoardName] = useState('');
  const [newListName, setNewListName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  // Card modal/form states
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [cardModalMode, setCardModalMode] = useState('create'); // 'create' or 'edit'
  const [targetListId, setTargetListId] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  
  // Card attributes
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardDueDate, setCardDueDate] = useState('');
  const [cardMemberId, setCardMemberId] = useState('');

  // Tag creation
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('#3b82f6');

  // Comment creation
  const [commentContent, setCommentContent] = useState('');

  // Load baseline data
  useEffect(() => {
    fetchBoards();
    fetchMembers();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get(`${API_BASE}/boards`);
      setBoards(res.data);
    } catch (err) {
      console.error('Error fetching boards', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error('Error fetching members', err);
    }
  };

  const selectBoard = async (board) => {
    try {
      const res = await axios.get(`${API_BASE}/boards/${board.id}`);
      setCurrentBoard(res.data);
      setActiveView('board');
    } catch (err) {
      console.error('Error loading board details', err);
    }
  };

  const refreshCurrentBoard = async () => {
    if (currentBoard) {
      selectBoard(currentBoard);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    try {
      await axios.post(`${API_BASE}/boards`, { name: newBoardName });
      setNewBoardName('');
      fetchBoards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBoard = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this board?')) return;
    try {
      await axios.delete(`${API_BASE}/boards/${id}`);
      fetchBoards();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim() || !currentBoard) return;
    try {
      await axios.post(`${API_BASE}/lists`, {
        board_id: currentBoard.id,
        name: newListName,
        position: currentBoard.lists ? currentBoard.lists.length : 0
      });
      setNewListName('');
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteList = async (id) => {
    if (!confirm('Are you sure you want to delete this list?')) return;
    try {
      await axios.delete(`${API_BASE}/lists/${id}`);
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    try {
      await axios.post(`${API_BASE}/members`, { name: newMemberName });
      setNewMemberName('');
      fetchMembers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await axios.delete(`${API_BASE}/members/${id}`);
      fetchMembers();
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  // Card Handlers
  const openCreateCardModal = (listId) => {
    setCardModalMode('create');
    setTargetListId(listId);
    setCardTitle('');
    setCardDesc('');
    setCardDueDate('');
    setCardMemberId('');
    setSelectedCard(null);
    setIsCardModalOpen(true);
  };

  const openEditCardModal = (card) => {
    setCardModalMode('edit');
    setSelectedCard(card);
    setCardTitle(card.title || '');
    setCardDesc(card.description || '');
    setCardDueDate(card.due_date ? card.due_date.substring(0, 16) : '');
    setCardMemberId(card.member_id || '');
    setTargetListId(card.list_id || '');
    setIsCardModalOpen(true);
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    if (!cardTitle.trim()) return;

    const payload = {
      title: cardTitle,
      description: cardDesc,
      due_date: cardDueDate || null,
      member_id: cardMemberId || null,
      list_id: targetListId
    };

    try {
      if (cardModalMode === 'create') {
        await axios.post(`${API_BASE}/cards`, payload);
      } else {
        await axios.put(`${API_BASE}/cards/${selectedCard.id}`, payload);
      }
      setIsCardModalOpen(false);
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard || !confirm('Are you sure you want to delete this card?')) return;
    try {
      await axios.delete(`${API_BASE}/cards/${selectedCard.id}`);
      setIsCardModalOpen(false);
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveCard = async (destListId) => {
    if (!selectedCard) return;
    try {
      await axios.post(`${API_BASE}/cards/${selectedCard.id}/move`, { list_id: destListId });
      setTargetListId(destListId);
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  // Tag Handlers
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!tagName.trim() || !selectedCard) return;
    try {
      const res = await axios.post(`${API_BASE}/tags`, {
        card_id: selectedCard.id,
        name: tagName,
        color: tagColor
      });
      // Refresh local selected card state to show tags instantly
      const updatedCard = { ...selectedCard, tags: [...(selectedCard.tags || []), res.data] };
      setSelectedCard(updatedCard);
      setTagName('');
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(`${API_BASE}/tags/${tagId}`);
      const updatedCard = {
        ...selectedCard,
        tags: selectedCard.tags.filter(t => t.id !== tagId)
      };
      setSelectedCard(updatedCard);
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  // Comment Handlers
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim() || !selectedCard) return;
    try {
      const res = await axios.post(`${API_BASE}/comments`, {
        card_id: selectedCard.id,
        content: commentContent
      });
      const updatedCard = {
        ...selectedCard,
        comments: [res.data, ...(selectedCard.comments || [])]
      };
      setSelectedCard(updatedCard);
      setCommentContent('');
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await axios.delete(`${API_BASE}/comments/${commentId}`);
      const updatedCard = {
        ...selectedCard,
        comments: selectedCard.comments.filter(c => c.id !== commentId)
      };
      setSelectedCard(updatedCard);
      refreshCurrentBoard();
    } catch (err) {
      console.error(err);
    }
  };

  // Helper function to check if a due date is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
      <div className="mesh-bg"></div>
      {/* Header */}
      <header className="app-header">
        <div className="brand" onClick={() => setActiveView('boards')} style={{ cursor: 'pointer' }}>
          <span className="brand-accent">⚡ Forge</span> Kanban
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => {
            setActiveView('members');
            setCurrentBoard(null);
          }}>Manage Members</button>
          <button className="btn-primary" onClick={() => setActiveView('boards')}>All Boards</button>
        </div>
      </header>

      {/* Main Content Area */}
      {activeView === 'boards' && (
        <>
          {/* Hero Landing Section */}
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-badge">⚡ Version 2.0 Live</div>
              <h1>
                Organize projects,<br />
                <span className="hero-gradient">One card at a time.</span>
              </h1>
              <p className="hero-subtitle">
                A premium, lightning-fast collaborative Kanban board built for agile teams. 
                Track tasks, assign members, style tags, and monitor overdue deadlines in real time.
              </p>
              <div className="hero-actions-row">
                <button className="btn-primary btn-lg" onClick={() => {
                  const el = document.getElementById('boards-dashboard');
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}>
                  Launch Dashboard ↓
                </button>
                <button className="btn-secondary btn-lg" onClick={() => {
                  setActiveView('members');
                  setCurrentBoard(null);
                }}>
                  Manage Team Members
                </button>
              </div>
            </div>

            {/* Interactive Hero Visual Mockup */}
            <div className="hero-visual">
              <div className="mockup-header">
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span className="mockup-dot red"></span>
                  <span className="mockup-dot yellow"></span>
                  <span className="mockup-dot green"></span>
                </div>
                <span className="mockup-title">Active Live Workspace</span>
              </div>
              <div className="mockup-body">
                <div className="mockup-col">
                  <h5>To Do</h5>
                  <div className="mockup-card">
                    <div className="card-tags"><span className="tag-badge" style={{ backgroundColor: '#818cf8' }}>Design</span></div>
                    <div className="card-title" style={{ fontSize: '0.85rem' }}>Refactor Hero UI/UX</div>
                    <div className="card-meta"><span className="date-badge">📅 Tomorrow</span></div>
                  </div>
                </div>
                <div className="mockup-col">
                  <h5>In Progress</h5>
                  <div className="mockup-card card-pulse">
                    <div className="card-tags"><span className="tag-badge" style={{ backgroundColor: '#10b981' }}>Live</span></div>
                    <div className="card-title" style={{ fontSize: '0.85rem' }}>Verify DB Migrations</div>
                    <div className="card-meta"><span className="assignee-badge">👤 Abhijeet</span></div>
                  </div>
                </div>
                <div className="mockup-col">
                  <h5>Overdue</h5>
                  <div className="mockup-card card-glow-rose">
                    <div className="card-tags"><span className="tag-badge" style={{ backgroundColor: '#f43f5e' }}>Critical</span></div>
                    <div className="card-title" style={{ fontSize: '0.85rem' }}>Verify SSL Certs</div>
                    <div className="card-meta"><span className="date-badge overdue">⚠️ Overdue</span></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Bar */}
          <section className="stats-bar">
            <div className="stat-item">
              <h3>SQLite 3</h3>
              <p>Database Core</p>
            </div>
            <div className="stat-item">
              <h3>&lt; 30ms</h3>
              <p>Response Latency</p>
            </div>
            <div className="stat-item">
              <h3>Vite + React</h3>
              <p>Frontend Engine</p>
            </div>
            <div className="stat-item">
              <h3>Laravel 13</h3>
              <p>API Service</p>
            </div>
          </section>

          {/* Dashboard Area */}
          <div id="boards-dashboard" className="boards-container" style={{ paddingTop: '6rem', position: 'relative' }}>
            <div className="mesh-bg-dashboard"></div>
            <div className="flex-between">
              <div>
                <h2>Workspace Boards</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Create or open a collaborative board to start listing cards.
                </p>
              </div>
              <form onSubmit={handleCreateBoard} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="New Board Name..."
                  className="form-control"
                  style={{ width: '250px' }}
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                />
                <button type="submit" className="btn-primary">Create Board</button>
              </form>
            </div>

          <div className="boards-grid">
            {boards.map(b => (
              <div key={b.id} className="board-card" onClick={() => selectBoard(b)}>
                <h3 style={{ marginBottom: '1rem' }}>{b.name}</h3>
                <button
                  className="btn-danger"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                  onClick={(e) => handleDeleteBoard(b.id, e)}
                >
                  Delete
                </button>
              </div>
            ))}
            {boards.length === 0 && (
              <p style={{ color: 'var(--text-secondary)' }}>No boards found. Create one to get started!</p>
            )}
          </div>
        </div>
      </>
      )}

      {activeView === 'members' && (
        <div className="boards-container">
          <h2>Manage Team Members</h2>
          <div className="manage-panel" style={{ marginTop: '1.5rem' }}>
            <form onSubmit={handleCreateMember} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ flexGrow: 1 }}>
                <input
                  type="text"
                  placeholder="Member Name..."
                  className="form-control"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Add Member</button>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem', width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem' }}>{m.name}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        className="btn-danger"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => handleDeleteMember(m.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan="2" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No team members added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'board' && currentBoard && (
        <div>
          {/* Board Header */}
          <div className="board-header">
            <h2>{currentBoard.name}</h2>
            <form onSubmit={handleCreateList} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="New List Name..."
                className="form-control"
                style={{ width: '200px' }}
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">Add List</button>
            </form>
          </div>

          {/* Kanban Lists Grid */}
          <div className="lists-wrapper">
            {currentBoard.lists && currentBoard.lists.map(list => (
              <div key={list.id} className="list-column">
                <div className="list-header">
                  <div className="list-title-area">
                    <h4>{list.name}</h4>
                    <span className="list-count">{list.cards ? list.cards.length : 0}</span>
                  </div>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                    onClick={() => handleDeleteList(list.id)}
                  >
                    🗑️
                  </button>
                </div>

                <div className="cards-container">
                  {list.cards && list.cards.map(card => {
                    const overdue = isOverdue(card.due_date);
                    return (
                      <div
                        key={card.id}
                        className={`kanban-card ${overdue ? 'card-overdue' : ''}`}
                        onClick={() => openEditCardModal(card)}
                      >
                        <div className="card-tags">
                          {card.tags && card.tags.map(t => (
                            <span
                              key={t.id}
                              className="tag-badge"
                              style={{ backgroundColor: t.color }}
                            >
                              {t.name}
                            </span>
                          ))}
                        </div>
                        <div className="card-title">{card.title}</div>
                        {card.description && (
                          <div className="card-desc">{card.description}</div>
                        )}
                        <div className="card-meta">
                          {card.due_date && (
                            <span className={`date-badge ${overdue ? 'overdue' : ''}`}>
                              📅 {new Date(card.due_date).toLocaleDateString()}
                            </span>
                          )}
                          {card.member && (
                            <span className="assignee-badge">
                              👤 {card.member.name}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <button
                    className="btn-secondary"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => openCreateCardModal(list.id)}
                  >
                    + Add Card
                  </button>
                </div>
              </div>
            ))}
            {(!currentBoard.lists || currentBoard.lists.length === 0) && (
              <div style={{ color: 'var(--text-secondary)', padding: '2rem' }}>
                This board has no lists yet. Create a list above to start mapping cards.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Card Form Modal */}
      {isCardModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCardModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
              <h3>{cardModalMode === 'create' ? 'Create Card' : 'Edit Card'}</h3>
              <button className="btn-secondary" style={{ padding: '0.2rem 0.5rem' }} onClick={() => setIsCardModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCardSubmit}>
              <div className="form-group">
                <label>Card Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={cardDesc}
                  onChange={(e) => setCardDesc(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={cardDueDate}
                  onChange={(e) => setCardDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Assignee</label>
                <select
                  className="form-control"
                  value={cardMemberId}
                  onChange={(e) => setCardMemberId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {cardModalMode === 'edit' && currentBoard && (
                <div className="form-group">
                  <label>Move to List (API-driven)</label>
                  <select
                    className="form-control"
                    value={targetListId}
                    onChange={(e) => handleMoveCard(e.target.value)}
                  >
                    {currentBoard.lists.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary" style={{ flexGrow: 1 }}>
                  {cardModalMode === 'create' ? 'Create' : 'Save'}
                </button>
                {cardModalMode === 'edit' && (
                  <button type="button" className="btn-danger" onClick={handleDeleteCard}>
                    Delete
                  </button>
                )}
              </div>
            </form>

            {cardModalMode === 'edit' && selectedCard && (
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h4>Tags</h4>
                <div className="card-tags" style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
                  {selectedCard.tags && selectedCard.tags.map(t => (
                    <span
                      key={t.id}
                      className="tag-badge"
                      style={{ backgroundColor: t.color, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      {t.name}
                      <span
                        style={{ cursor: 'pointer', opacity: 0.7, fontSize: '0.8rem' }}
                        onClick={() => handleDeleteTag(t.id)}
                      >
                        ✕
                      </span>
                    </span>
                  ))}
                  {(!selectedCard.tags || selectedCard.tags.length === 0) && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No tags yet.</span>
                  )}
                </div>

                <form onSubmit={handleAddTag} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="New Tag Name..."
                    className="form-control"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    required
                  />
                  <input
                    type="color"
                    className="form-control"
                    style={{ width: '50px', padding: '2px', cursor: 'pointer' }}
                    value={tagColor}
                    onChange={(e) => setTagColor(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Add</button>
                </form>

                {/* Comments Section */}
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <h4>Comments & Activity</h4>
                  <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <textarea
                      placeholder="Write a comment..."
                      className="form-control"
                      rows="2"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                      Post Comment
                    </button>
                  </form>

                  <div className="comments-list" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {selectedCard.comments && selectedCard.comments.map(c => (
                      <div key={c.id} className="comment-item" style={{ background: 'var(--bg-tertiary)', padding: '0.85rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.35rem', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <span style={{ fontWeight: '600' }}>Activity Note</span>
                          <span>{new Date(c.created_at).toLocaleString()}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', paddingRight: '4rem' }}>{c.content}</p>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ position: 'absolute', right: '0.5rem', bottom: '0.5rem', padding: '0.2rem 0.4rem', fontSize: '0.7rem', color: 'var(--danger-color)', border: 'none', background: 'transparent' }}
                          onClick={() => handleDeleteComment(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {(!selectedCard.comments || selectedCard.comments.length === 0) && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No comments yet.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
