import { useState, useEffect, useRef } from "react";
import { FaEnvelope, FaSearch, FaPaperPlane } from "react-icons/fa";
import MenuLateral from "../../componentes/menuLateral";
import { API_URL } from "../../config/api";
import "./Mensagens.css";

const getInitials = (name) => {
  if (!name) return "HT";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join("")
    .toUpperCase();
};

export default function Mensagens() {
  const [conversations, setConversations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("conversas"); // "conversas" ou "todos"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const loggedUser = JSON.parse(localStorage.getItem("usuario") || "{}");
  const token = localStorage.getItem("token");

  // Fetch active conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error("Erro ao buscar conversas:", err);
    }
  };

  // Fetch all registered users
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error("Erro ao buscar todos os usuários:", err);
    }
  };

  // Fetch messages for selected user
  const fetchMessages = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Erro ao buscar mensagens:", err);
    }
  };

  // Handle user search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/usuarios/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (err) {
        console.error("Erro ao pesquisar usuários:", err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, token]);

  // Load initial data
  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
    
    const intervalConversations = setInterval(fetchConversations, 8000);
    return () => clearInterval(intervalConversations);
  }, [token]);

  // Load messages and start polling when user is selected
  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser.id);
    const interval = setInterval(() => fetchMessages(selectedUser.id), 3000);

    return () => clearInterval(interval);
  }, [selectedUser, token]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || sending) return;

    setSending(true);
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: selectedUser.id,
          content: newMessage.trim(),
        }),
      });

      if (res.ok) {
        const message = await res.json();
        setMessages((prev) => [...prev, message]);
        setNewMessage("");
        fetchConversations();
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    } finally {
      setSending(false);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="mensagens-page-container">
      <MenuLateral />

      <div className="mensagens-content-wrapper">
        {/* Sidebar */}
        <aside className="mensagens-sidebar">
          <div className="sidebar-header">
            <h2>Mensagens</h2>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Buscar usuário por nome ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Abas */}
            {!searchQuery.trim() && (
              <div 
                className="messages-tabs" 
                style={{ 
                  display: 'flex', 
                  marginTop: '15px', 
                  borderBottom: '1px solid #e2e8f0',
                  gap: '10px'
                }}
              >
                <button 
                  onClick={() => setActiveTab("conversas")}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === "conversas" ? '2px solid #3b82f6' : 'none',
                    color: activeTab === "conversas" ? '#3b82f6' : '#64748b',
                    fontWeight: activeTab === "conversas" ? '600' : 'normal',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Conversas
                </button>
                <button 
                  onClick={() => setActiveTab("todos")}
                  style={{
                    flex: 1,
                    padding: '10px 0',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === "todos" ? '2px solid #3b82f6' : 'none',
                    color: activeTab === "todos" ? '#3b82f6' : '#64748b',
                    fontWeight: activeTab === "todos" ? '600' : 'normal',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s'
                  }}
                >
                  Contatos ({allUsers.length})
                </button>
              </div>
            )}
          </div>

          <div className="sidebar-list">
            {/* Resultados de Busca */}
            {searchQuery.trim() && (
              <>
                <div className="list-section-title">Resultados da busca</div>
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <div
                      key={user.id}
                      className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
                      onClick={() => handleSelectUser(user)}
                    >
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.nomecompleto} className="user-avatar" />
                      ) : (
                        <div className="user-avatar">{getInitials(user.nomecompleto)}</div>
                      )}
                      <div className="user-info">
                        <div className="user-name">{user.nomecompleto}</div>
                        <div className="user-subtext">
                          {user.nome_empresa ? `${user.nome_empresa} • ` : ""}@{user.username}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "0.9rem" }}>
                    Nenhum usuário encontrado.
                  </div>
                )}
              </>
            )}

            {/* Lista com Abas (quando não houver query de busca) */}
            {!searchQuery.trim() && activeTab === "conversas" && (
              <>
                <div className="list-section-title">Conversas Recentes</div>
                {conversations.length > 0 ? (
                  conversations.map(({ otherUser, lastMessage }) => (
                    <div
                      key={otherUser.id}
                      className={`user-item ${selectedUser?.id === otherUser.id ? "active" : ""}`}
                      onClick={() => handleSelectUser(otherUser)}
                    >
                      {otherUser.avatar_url ? (
                        <img src={otherUser.avatar_url} alt={otherUser.nomecompleto} className="user-avatar" />
                      ) : (
                        <div className="user-avatar">{getInitials(otherUser.nomecompleto)}</div>
                      )}
                      <div className="user-info">
                        <div className="user-name-row">
                          <span className="user-name">{otherUser.nomecompleto}</span>
                          <span className="message-time">
                            {new Date(lastMessage.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="user-subtext">
                          {lastMessage.sender_id === loggedUser.id ? "Você: " : ""}
                          {lastMessage.content}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b", fontSize: "0.9rem" }}>
                    Nenhuma conversa iniciada. Acesse a aba "Contatos" para iniciar um chat!
                  </div>
                )}
              </>
            )}

            {!searchQuery.trim() && activeTab === "todos" && (
              <>
                <div className="list-section-title">Todos os Usuários</div>
                {allUsers.length > 0 ? (
                  allUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`user-item ${selectedUser?.id === user.id ? "active" : ""}`}
                      onClick={() => handleSelectUser(user)}
                    >
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.nomecompleto} className="user-avatar" />
                      ) : (
                        <div className="user-avatar">{getInitials(user.nomecompleto)}</div>
                      )}
                      <div className="user-info">
                        <div className="user-name">{user.nomecompleto}</div>
                        <div className="user-subtext">
                          {user.nome_empresa ? `${user.nome_empresa} • ` : ""}@{user.username}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748b", fontSize: "0.9rem" }}>
                    Nenhum usuário cadastrado.
                  </div>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Chat Area */}
        <main className="mensagens-chat-area">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <header className="chat-header">
                <div className="chat-header-info">
                  {selectedUser.avatar_url ? (
                    <img src={selectedUser.avatar_url} alt={selectedUser.nomecompleto} className="user-avatar" />
                  ) : (
                    <div className="user-avatar">{getInitials(selectedUser.nomecompleto)}</div>
                  )}
                  <div>
                    <h3>{selectedUser.nomecompleto}</h3>
                    <p>{selectedUser.nome_empresa ? selectedUser.nome_empresa : `@${selectedUser.username}`}</p>
                  </div>
                </div>
              </header>

              {/* Messages Body */}
              <div className="chat-body">
                {messages.map((msg) => {
                  const isSentByMe = msg.sender_id === loggedUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`message-bubble-wrapper ${isSentByMe ? "sent" : "received"}`}
                    >
                      <div className="message-bubble">
                        {msg.content}
                        <span className="message-meta">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Footer Input */}
              <footer className="chat-footer">
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    required
                  />
                  <button type="submit" className="send-btn" disabled={!newMessage.trim() || sending}>
                    <FaPaperPlane style={{ marginRight: newMessage.trim() ? "8px" : "0px" }} />
                    {newMessage.trim() && <span>Enviar</span>}
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="no-chat-selected">
              <FaEnvelope className="no-chat-icon" />
              <h3>Nenhuma conversa selecionada</h3>
              <p>Escolha um contato na lista lateral ou busque por um e-mail/nome para começar a conversar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
