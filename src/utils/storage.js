/**
 * Budget Planner - Storage Manager
 * Mengelola semua operasi penyimpanan data di localStorage
 */

// Kelas untuk mengelola storage
export class StorageManager {
  static TRANSACTIONS_KEY = "transactions";
  static CATEGORIES_KEY = "categories";
  static BUDGET_KEY = "budget";
  static USER_KEY = "userEmail";
  static THEME_KEY = "darkMode";
  static REGISTERED_USERS_KEY = "registeredUsers";

  /**
   * Inisialisasi storage dengan data default
   */
  static initialize() {
    // Initialize categories jika belum ada
    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      const defaultCategories = [
        "Makanan",
        "Transportasi",
        "Hiburan",
        "Pendidikan",
        "Tagihan",
        "Kesehatan",
        "Belanja",
        "Lain-lain"
      ];

      localStorage.setItem(
        this.CATEGORIES_KEY,
        JSON.stringify(defaultCategories)
      );
    }

    // Initialize transactions jika belum ada
    if (!localStorage.getItem(this.TRANSACTIONS_KEY)) {
      const dummyTransactions = [
        {
          id: 1,
          name: "Uang Saku Bulan Januari",
          amount: 1500000,
          type: "income",
          category: "Gaji",
          date: "2025-01-01"
        },
        {
          id: 2,
          name: "Makan Siang",
          amount: 25000,
          type: "expense",
          category: "Makanan",
          date: "2025-01-02"
        },
        {
          id: 3,
          name: "Bensin Motor",
          amount: 100000,
          type: "expense",
          category: "Transportasi",
          date: "2025-01-03"
        },
        {
          id: 4,
          name: "Nonton Bioskop",
          amount: 150000,
          type: "expense",
          category: "Hiburan",
          date: "2025-01-04"
        },
        {
          id: 5,
          name: "Beli Buku",
          amount: 75000,
          type: "expense",
          category: "Pendidikan",
          date: "2025-01-05"
        }
      ];

      localStorage.setItem(
        this.TRANSACTIONS_KEY,
        JSON.stringify(dummyTransactions)
      );
    }
  }

  // ========== TRANSACTIONS ==========

  /**
   * Ambil semua transaksi
   */
  static getTransactions() {
    return JSON.parse(
      localStorage.getItem(this.TRANSACTIONS_KEY)
    ) || [];
  }

  /**
   * Simpan transaksi
   */
  static saveTransactions(data) {
    localStorage.setItem(
      this.TRANSACTIONS_KEY,
      JSON.stringify(data)
    );
  }

  /**
   * Tambah transaksi baru
   */
  static addTransaction(transaction) {
    const transactions = this.getTransactions();
    const newId = Math.max(...transactions.map(t => t.id || 0), 0) + 1;
    transactions.push({ ...transaction, id: newId });
    this.saveTransactions(transactions);
    return transactions;
  }

  /**
   * Hapus transaksi berdasarkan ID
   */
  static deleteTransaction(id) {
    const transactions = this.getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    this.saveTransactions(filtered);
    return filtered;
  }

  /**
   * Update transaksi
   */
  static updateTransaction(id, updatedData) {
    const transactions = this.getTransactions();
    const updated = transactions.map(t => 
      t.id === id ? { ...t, ...updatedData } : t
    );
    this.saveTransactions(updated);
    return updated;
  }

  // ========== CATEGORIES ==========

  /**
   * Ambil semua kategori
   */
  static getCategories() {
    return JSON.parse(
      localStorage.getItem(this.CATEGORIES_KEY)
    ) || [];
  }

  /**
   * Simpan kategori
   */
  static saveCategories(categories) {
    localStorage.setItem(
      this.CATEGORIES_KEY,
      JSON.stringify(categories)
    );
  }

  /**
   * Tambah kategori baru
   */
  static addCategory(category) {
    const categories = this.getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      this.saveCategories(categories);
    }
    return categories;
  }

  /**
   * Hapus kategori
   */
  static deleteCategory(category) {
    const categories = this.getCategories();
    const filtered = categories.filter(c => c !== category);
    this.saveCategories(filtered);
    return filtered;
  }

  // ========== BUDGET ==========

  /**
   * Simpan budget bulanan
   */
  static saveBudget(amount) {
    localStorage.setItem(this.BUDGET_KEY, amount);
  }

  /**
   * Ambil budget bulanan
   */
  static getBudget() {
    return Number(localStorage.getItem(this.BUDGET_KEY)) || 0;
  }

  // ========== THEMES ==========

  /**
   * Set tema (dark/light)
   */
  static setTheme(isDark) {
    localStorage.setItem(this.THEME_KEY, isDark);
  }

  /**
   * Ambil tema
   */
  static getTheme() {
    return localStorage.getItem(this.THEME_KEY) === 'true';
  }

  // ========== USER ==========

  /**
   * Set user email
   */
  static setUserEmail(email) {
    localStorage.setItem(this.USER_KEY, email);
  }

  /**
   * Ambil user email
   */
  static getUserEmail() {
    return localStorage.getItem(this.USER_KEY);
  }

  /**
   * Ambil daftar semua user terdaftar
   */
  static getRegisteredUsers() {
    const users = localStorage.getItem(this.REGISTERED_USERS_KEY);
    if (!users) {
      // Default seed user
      const defaultUsers = [
        {
          name: "Admin Saku.in",
          email: "admin@saku.in",
          password: "password123"
        }
      ];
      localStorage.setItem(this.REGISTERED_USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(users);
  }

  /**
   * Daftarkan user baru
   */
  static registerUser(user) {
    const users = this.getRegisteredUsers();
    // Cek jika email sudah terdaftar
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      return { success: false, message: "Email ini sudah terdaftar." };
    }
    users.push(user);
    localStorage.setItem(this.REGISTERED_USERS_KEY, JSON.stringify(users));
    return { success: true, message: "Pendaftaran berhasil!" };
  }

  /**
   * Otentikasi login
   */
  static authenticateUser(email, password) {
    const users = this.getRegisteredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      return { success: true, user: found };
    }
    return { success: false, message: "Email atau password salah." };
  }

  /**
   * Logout - hapus semua data sesi tetapi simpan daftar akun
   */
  static logout() {
    const users = localStorage.getItem(this.REGISTERED_USERS_KEY);
    localStorage.clear();
    if (users) {
      localStorage.setItem(this.REGISTERED_USERS_KEY, users);
    }
    this.initialize();
  }
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Format number menjadi format Rupiah
 */
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Hitung total income, expense, dan balance
 */
export const calculateTotals = () => {
  const transactions = StorageManager.getTransactions();
  
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return { income, expense, balance };
};

/**
 * Hitung expense per kategori
 */
export const calculateExpensesByCategory = () => {
  const transactions = StorageManager.getTransactions();
  const categories = {};

  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

  return categories;
};

/**
 * Hitung kategori pengeluaran terbesar
 */
export const getLargestExpenseCategory = () => {
  const categories = calculateExpensesByCategory();
  
  if (Object.keys(categories).length === 0) {
    return { category: '-', amount: 0 };
  }

  const largest = Object.entries(categories).reduce((max, [cat, amount]) => 
    amount > max.amount ? { category: cat, amount } : max
  );

  return largest;
};

/**
 * Filter transaksi berdasarkan tipe
 */
export const filterTransactionsByType = (type) => {
  const transactions = StorageManager.getTransactions();
  return transactions.filter(t => t.type === type);
};

/**
 * Filter transaksi berdasarkan kategori
 */
export const filterTransactionsByCategory = (category) => {
  const transactions = StorageManager.getTransactions();
  return transactions.filter(t => t.category === category);
};

/**
 * Filter transaksi berdasarkan range tanggal
 */
export const filterTransactionsByDateRange = (startDate, endDate) => {
  const transactions = StorageManager.getTransactions();
  return transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate >= new Date(startDate) && tDate <= new Date(endDate);
  });
};

/**
 * Hitung budget sisa
 */
export const calculateRemainingBudget = () => {
  const budget = StorageManager.getBudget();
  const { expense } = calculateTotals();
  return budget - expense;
};

/**
 * Hitung persentase penggunaan budget
 */
export const calculateBudgetUsagePercentage = () => {
  const budget = StorageManager.getBudget();
  if (budget === 0) return 0;
  
  const { expense } = calculateTotals();
  return Math.round((expense / budget) * 100);
};

// Initialize storage saat file dimuat
StorageManager.initialize();
