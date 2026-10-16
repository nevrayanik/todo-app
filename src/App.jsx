import { useState, useEffect } from 'react';

function App() {
  // LocalStorage'dan verileri çek, yoksa boş dizi başlat
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null); // Güncelleme modu için

  // Todos dizisi her değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // 1. EKLEME VE GÜNCELLEME İŞLEMİ
  const handleSubmit = () => {
    if (inputValue.trim() === '') return;

    if (editId) {
      // Güncelleme
      setTodos(todos.map(todo => 
        todo.id === editId ? { ...todo, text: inputValue } : todo
      ));
      setEditId(null);
    } else {
      // Yeni Ekleme
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
    }
    setInputValue('');
  };

  // 2. SİLME İŞLEMİ
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 3. TAMAMLANDI OLARAK İŞARETLEME (Güncelleme)
  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 4. DÜZENLEME MODUNU BAŞLATMA (Güncelleme)
  const startEdit = (todo) => {
    setInputValue(todo.text);
    setEditId(todo.id);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Yapılacaklar Listesi</h1>
        
        {/* Ekleme / Güncelleme Alanı */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Bir görev yazın..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button 
            onClick={handleSubmit}
            className={`px-5 py-2 rounded-lg text-white font-medium transition ${editId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {editId ? 'Güncelle' : 'Ekle'}
          </button>
        </div>

        {/* Listeleme Alanı */}
        <ul className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-center text-gray-400 py-4">Henüz görev eklenmedi.</p>
          ) : (
            todos.map(todo => (
              <li key={todo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <input 
                    type="checkbox" 
                    checked={todo.completed} 
                    onChange={() => toggleComplete(todo.id)}
                    className="w-5 h-5 cursor-pointer accent-blue-500"
                  />
                  <span className={`truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {todo.text}
                  </span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => startEdit(todo)}
                    className="text-yellow-600 hover:text-yellow-800 text-sm font-semibold px-2 py-1"
                  >
                    Düzenle
                  </button>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold px-2 py-1"
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;