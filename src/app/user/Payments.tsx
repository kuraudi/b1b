"use client";
import React, { useState, useMemo } from "react";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Receipt,
  ArrowUpRight,
  Download,
  Loader2,
  Banknote,
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard as CardIcon,
  Wallet,
  ArrowUpDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileSpreadsheet,
  Printer,
  Send,
  Archive,
  MoreHorizontal,
  Copy,
  Edit,
  Trash2,
} from "lucide-react";

const mockPayments = [
  {
    id: "INV-000234",
    date: "2025-07-09",
    amount: 150000,
    status: "paid",
    method: "Банковская карта",
    description: "Оплата заказа #4921",
    receiptUrl: "#",
    clientName: "ООО Строй-Инвест",
    clientEmail: "finance@stroyinvest.ru",
    clientPhone: "+7 (495) 123-45-67",
    vatAmount: 25000,
    category: "Материалы",
    contractNumber: "Д-2025-123",
    dueDate: "2025-07-15",
    paymentDate: "2025-07-09",
    manager: "Иванов А.С.",
    notes: "Оплата в срок, без замечаний",
  },
  {
    id: "INV-000233",
    date: "2025-07-05",
    amount: 70000,
    status: "pending",
    method: "Рассрочка",
    description: "Оплата заказа #4918",
    receiptUrl: "#",
    clientName: "ИП Петров С.В.",
    clientEmail: "petrov@mail.ru",
    clientPhone: "+7 (903) 456-78-90",
    vatAmount: 11667,
    category: "Услуги",
    contractNumber: "Д-2025-118",
    dueDate: "2025-07-12",
    paymentDate: null,
    manager: "Сидорова М.А.",
    notes: "Ожидает согласования",
  },
  {
    id: "INV-000232",
    date: "2025-07-02",
    amount: 1290000,
    status: "failed",
    method: "Безналичный расчет",
    description: "Оплата заказа #4910",
    receiptUrl: "#",
    clientName: "ООО ТехноГрупп",
    clientEmail: "payments@technogroup.ru",
    clientPhone: "+7 (812) 987-65-43",
    vatAmount: 215000,
    category: "Оборудование",
    contractNumber: "Д-2025-095",
    dueDate: "2025-07-01",
    paymentDate: null,
    manager: "Козлов В.И.",
    notes: "Ошибка в реквизитах, требует исправления",
  },
  {
    id: "INV-000231",
    date: "2025-06-28",
    amount: 340000,
    status: "paid",
    method: "Банковская карта",
    description: "Оплата заказа #4905",
    receiptUrl: "#",
    clientName: "ООО Альфа-Строй",
    clientEmail: "office@alfastroy.ru",
    clientPhone: "+7 (495) 234-56-78",
    vatAmount: 56667,
    category: "Материалы",
    contractNumber: "Д-2025-087",
    dueDate: "2025-06-30",
    paymentDate: "2025-06-28",
    manager: "Иванов А.С.",
    notes: "Оплачено досрочно",
  },
  {
    id: "INV-000230",
    date: "2025-06-25",
    amount: 890000,
    status: "overdue",
    method: "Безналичный расчет",
    description: "Оплата заказа #4900",
    receiptUrl: "#",
    clientName: "ООО МегаТрейд",
    clientEmail: "finance@megatrade.ru",
    clientPhone: "+7 (812) 345-67-89",
    vatAmount: 148333,
    category: "Товары",
    contractNumber: "Д-2025-082",
    dueDate: "2025-06-20",
    paymentDate: null,
    manager: "Сидорова М.А.",
    notes: "Просрочка 25 дней, направлено уведомление",
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("ru-RU") + " ₽";
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ru-RU");
}

function getDaysOverdue(dueDate: string) {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export default function PaymentsPage() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Фильтрация и поиск
  const filteredPayments = useMemo(() => {
    let filtered = mockPayments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;
      const matchesMethod =
        methodFilter === "all" || payment.method === methodFilter;
      const matchesCategory =
        categoryFilter === "all" || payment.category === categoryFilter;

      let matchesDate = true;
      if (dateFilter !== "all") {
        const paymentDate = new Date(payment.date);
        const today = new Date();
        const daysDiff = Math.floor(
          (today - paymentDate) / (1000 * 60 * 60 * 24)
        );

        switch (dateFilter) {
          case "today":
            matchesDate = daysDiff === 0;
            break;
          case "week":
            matchesDate = daysDiff <= 7;
            break;
          case "month":
            matchesDate = daysDiff <= 30;
            break;
          case "quarter":
            matchesDate = daysDiff <= 90;
            break;
        }
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod &&
        matchesCategory &&
        matchesDate
      );
    });

    // Сортировка
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "client":
          aValue = a.clientName;
          bValue = b.clientName;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.date;
          bValue = b.date;
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [
    searchTerm,
    statusFilter,
    methodFilter,
    categoryFilter,
    dateFilter,
    sortBy,
    sortOrder,
  ]);

  // Пагинация
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Статистика
  const stats = useMemo(() => {
    const totalAmount = filteredPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    const paidAmount = filteredPayments
      .filter((p) => p.status === "paid")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const pendingAmount = filteredPayments
      .filter((p) => p.status === "pending")
      .reduce((sum, payment) => sum + payment.amount, 0);
    const overdueAmount = filteredPayments
      .filter((p) => p.status === "overdue")
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      totalAmount,
      paidAmount,
      pendingAmount,
      overdueAmount,
      totalCount: filteredPayments.length,
      paidCount: filteredPayments.filter((p) => p.status === "paid").length,
      pendingCount: filteredPayments.filter((p) => p.status === "pending")
        .length,
      overdueCount: filteredPayments.filter((p) => p.status === "overdue")
        .length,
    };
  }, [filteredPayments]);

  function handlePay(id: string) {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Здесь будет логика оплаты
    }, 1200);
  }

  function handleSort(field: string) {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }

  function handleExport(format: string) {
    console.log(`Экспорт в формате ${format}`);
    // Здесь будет логика экспорта
  }

  function handleBulkAction(action: string) {
    console.log(
      `Массовое действие: ${action} для ${selectedItems.size} элементов`
    );
    // Здесь будет логика массовых операций
  }

  function toggleSelectAll() {
    if (selectedItems.size === paginatedPayments.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedPayments.map((p) => p.id)));
    }
  }

  function toggleSelectItem(id: string) {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  }

  const PaymentDetailsModal = ({ payment, onClose }) => {
    if (!payment) return null;

    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
        <div className="bg-[#232323]/0 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#232136]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-nekstmedium text-white">
              Детали платежа
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#404040] rounded-xl transition"
            >
              <X className="w-5 h-5 text-[#BFAAFF]" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#BFAAFF] text-sm mb-1 block">
                  Номер счета
                </label>
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-[#8C7FF5]" />
                  <span className="text-white font-nekstmedium">
                    {payment.id}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[#BFAAFF] text-sm mb-1 block">
                  Статус
                </label>
                <div className="flex items-center gap-2">
                  {payment.status === "paid" && (
                    <CheckCircle className="w-4 h-4 text-[#36cb7f]" />
                  )}
                  {payment.status === "pending" && (
                    <Clock className="w-4 h-4 text-[#FFD700]" />
                  )}
                  {payment.status === "failed" && (
                    <XCircle className="w-4 h-4 text-[#FF3A3A]" />
                  )}
                  {payment.status === "overdue" && (
                    <AlertCircle className="w-4 h-4 text-[#FF6B35]" />
                  )}
                  <span className="text-white capitalize">
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#BFAAFF] text-sm mb-1 block">
                  Сумма
                </label>
                <div className="text-2xl font-nekstmedium text-[#8C7FF5]">
                  {formatPrice(payment.amount)}
                </div>
              </div>

              <div>
                <label className="text-[#BFAAFF] text-sm mb-1 block">НДС</label>
                <div className="text-lg text-white">
                  {formatPrice(payment.vatAmount)}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[#BFAAFF] text-sm mb-1 block">
                Клиент
              </label>
              <div className="bg-[#232136] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#8C7FF5]" />
                  <span className="text-white font-nekstmedium">
                    {payment.clientName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#8C7FF5]" />
                  <span className="text-[#BFAAFF]">{payment.clientEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#8C7FF5]" />
                  <span className="text-[#BFAAFF]">{payment.clientPhone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#BFAAFF] text-sm mb-1 block">
                  Договор
                </label>
                <span className="text-white">{payment.contractNumber}</span>
              </div>

              <div>
                <label className="text-[#BFAAFF] text-sm mb-1 block">
                  Категория
                </label>
                <span className="text-white">{payment.category}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#BFAAFF] text-sm mb-1 block">
                  Дата выставления
                </label>
                <span className="text-white">{formatDate(payment.date)}</span>
              </div>

              <div>
                <label className="text-[#BFAAFF] text-sm mb-1 block">
                  Срок оплаты
                </label>
                <span className="text-white">
                  {formatDate(payment.dueDate)}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[#BFAAFF] text-sm mb-1 block">
                Менеджер
              </label>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#8C7FF5]" />
                <span className="text-white">{payment.manager}</span>
              </div>
            </div>

            <div>
              <label className="text-[#BFAAFF] text-sm mb-1 block">
                Примечания
              </label>
              <div className="bg-[#232136] rounded-xl p-4">
                <span className="text-[#BFAAFF]">{payment.notes}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#8C7FF5] text-[#232136] rounded-xl font-nekstmedium hover:bg-[#BFAAFF] transition">
                <Download className="w-4 h-4" />
                Скачать чек
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#232136] text-[#8C7FF5] rounded-xl font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition">
                <Copy className="w-4 h-4" />
                Копировать
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#232136] text-[#8C7FF5] rounded-xl font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition">
                <Send className="w-4 h-4" />
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/0 min-h-screen flex flex-col items-center py-8 px-2 animate-fade-in">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-9 h-9 text-[#8C7FF5]" />
            <h1 className="text-3xl font-nekstmedium text-white">
              Платежи и счета
            </h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#232136] text-[#8C7FF5] rounded-xl border border-[#8C7FF5] hover:bg-[#404040] transition"
          >
            <Filter className="w-4 h-4" />
            Фильтры
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-6 h-6 text-[#36cb7f]" />
              <span className="text-[#BFAAFF] font-nekstmedium">Оплачено</span>
            </div>
            <div className="text-2xl font-nekstmedium text-white mb-1">
              {formatPrice(stats.paidAmount)}
            </div>
            <div className="text-sm text-[#36cb7f]">
              {stats.paidCount} счетов
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-6 h-6 text-[#FFD700]" />
              <span className="text-[#BFAAFF] font-nekstmedium">Ожидают</span>
            </div>
            <div className="text-2xl font-nekstmedium text-white mb-1">
              {formatPrice(stats.pendingAmount)}
            </div>
            <div className="text-sm text-[#FFD700]">
              {stats.pendingCount} счетов
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-6 h-6 text-[#FF6B35]" />
              <span className="text-[#BFAAFF] font-nekstmedium">
                Просрочено
              </span>
            </div>
            <div className="text-2xl font-nekstmedium text-white mb-1">
              {formatPrice(stats.overdueAmount)}
            </div>
            <div className="text-sm text-[#FF6B35]">
              {stats.overdueCount} счетов
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Receipt className="w-6 h-6 text-[#8C7FF5]" />
              <span className="text-[#BFAAFF] font-nekstmedium">Всего</span>
            </div>
            <div className="text-2xl font-nekstmedium text-white mb-1">
              {formatPrice(stats.totalAmount)}
            </div>
            <div className="text-sm text-[#8C7FF5]">
              {stats.totalCount} счетов
            </div>
          </div>
        </div>

        {/* New payment block */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-3xl px-8 py-6 shadow-xl">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-nekstmedium text-white mb-1 flex items-center gap-2">
              <Banknote className="w-6 h-6 text-[#8C7FF5]" />
              Новый платёж или счёт
            </span>
            <span className="text-[#b8b8d1] text-base">
              Создайте новый счёт для клиента или пополните баланс компании.
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium text-lg shadow-lg hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition"
            >
              <Plus className="w-5 h-5" />
              Создать счёт
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#232136] text-[#8C7FF5] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition">
              <Wallet className="w-5 h-5" />
              Пополнить баланс
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-nekstmedium text-white">Фильтры</h3>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setMethodFilter("all");
                  setCategoryFilter("all");
                  setDateFilter("all");
                }}
                className="text-[#8C7FF5] hover:text-[#BFAAFF] transition"
              >
                Очистить все
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8C7FF5]" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#232136] border border-[#8C7FF5] rounded-xl text-white placeholder-[#BFAAFF] focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-[#232136] border border-[#8C7FF5] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]"
              >
                <option value="all">Все статусы</option>
                <option value="paid">Оплачено</option>
                <option value="pending">Ожидает</option>
                <option value="failed">Ошибка</option>
                <option value="overdue">Просрочено</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="px-4 py-2 bg-[#232136] border border-[#8C7FF5] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]"
              >
                <option value="all">Все способы</option>
                <option value="Банковская карта">Банковская карта</option>
                <option value="Безналичный расчет">Безналичный расчет</option>
                <option value="Рассрочка">Рассрочка</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-[#232136] border border-[#8C7FF5] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]"
              >
                <option value="all">Все категории</option>
                <option value="Материалы">Материалы</option>
                <option value="Услуги">Услуги</option>
                <option value="Оборудование">Оборудование</option>
                <option value="Товары">Товары</option>
              </select>

              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-[#232136] border border-[#8C7FF5] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]"
              >
                <option value="all">Все даты</option>
                <option value="today">Сегодня</option>
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
              </select>
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <span className="text-[#BFAAFF] text-sm">
              Показано {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, filteredPayments.length)} из{" "}
              {filteredPayments.length}
            </span>
            {selectedItems.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[#8C7FF5] text-sm">
                  Выбrano: {selectedItems.size}
                </span>
                <button
                  onClick={() => handleBulkAction("export")}
                  className="flex items-center gap-1 px-3 py-1 bg-[#232136] text-[#8C7FF5] rounded-lg border border-[#8C7FF5] hover:bg-[#404040] transition text-sm"
                >
                  <Download className="w-3 h-3" />
                  Экспорт
                </button>
                <button
                  onClick={() => handleBulkAction("archive")}
                  className="flex items-center gap-1 px-3 py-1 bg-[#232136] text-[#8C7FF5] rounded-lg border border-[#8C7FF5] hover:bg-[#404040] transition text-sm"
                >
                  <Archive className="w-3 h-3" />
                  Архив
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("excel")}
              className="flex items-center gap-2 px-4 py-2 bg-[#232136] text-[#8C7FF5] rounded-xl border border-[#8C7FF5] hover:bg-[#404040] transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="flex items-center gap-2 px-4 py-2 bg-[#232136] text-[#8C7FF5] rounded-xl border border-[#8C7FF5] hover:bg-[#404040] transition"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-[#232136] text-[#8C7FF5] rounded-xl border border-[#8C7FF5] hover:bg-[#404040] transition"
            >
              <RefreshCw className="w-4 h-4" />
              Обновить
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-3xl p-0 md:p-8 shadow-2xl overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="text-[#BFAAFF] text-lg font-nekstmedium border-b border-[#232136]">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.size === paginatedPayments.length &&
                      paginatedPayments.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-[#8C7FF5] bg-[#232136] border-[#8C7FF5] rounded focus:ring-[#8C7FF5]"
                  />
                </th>
                <th className="py-3 px-4 text-left">
                  <button
                    onClick={() => handleSort("id")}
                    className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                  >
                    Счёт
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-left">
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                  >
                    Дата
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-left">
                  <button
                    onClick={() => handleSort("client")}
                    className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                  >
                    Клиент
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-left">Описание</th>
                <th className="py-3 px-4 text-left">Способ</th>
                <th className="py-3 px-4 text-left">Категория</th>
                <th className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleSort("amount")}
                    className="flex items-center gap-2 hover:text-[#8C7FF5] transition ml-auto"
                  >
                    Сумма
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                  >
                    Статус
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="py-3 px-4 text-center">Действия</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-[#232136] hover:bg-[#2b2259]/15 transition"
                >
                  <td className="py-5 px-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(payment.id)}
                      onChange={() => toggleSelectItem(payment.id)}
                      className="w-4 h-4 text-[#8C7FF5] bg-[#232136] border-[#8C7FF5] rounded focus:ring-[#8C7FF5]"
                    />
                  </td>
                  <td className="py-5 px-4 font-nekstmedium text-white">
                    <span className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-[#8C7FF5]" />
                      {payment.id}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[#BFAAFF]">
                    <div className="flex flex-col">
                      <span>{formatDate(payment.date)}</span>
                      <span className="text-xs text-[#8C7FF5]">
                        Срок: {formatDate(payment.dueDate)}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex flex-col">
                      <span className="text-white font-nekstmedium">
                        {payment.clientName}
                      </span>
                      <span className="text-[#BFAAFF] text-sm">
                        {payment.clientEmail}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-[#b8b8d1]">
                    <div className="flex flex-col">
                      <span>{payment.description}</span>
                      <span className="text-xs text-[#8C7FF5]">
                        Договор: {payment.contractNumber}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-[#8C7FF5]">{payment.method}</td>
                  <td className="py-5 px-4 text-[#BFAAFF]">
                    {payment.category}
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-[#8C7FF5] font-nekstmedium text-lg">
                        {formatPrice(payment.amount)}
                      </span>
                      <span className="text-[#BFAAFF] text-sm">
                        НДС: {formatPrice(payment.vatAmount)}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      {payment.status === "paid" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#36cb7f]/20 text-[#36cb7f] text-sm font-nekstmedium">
                          <CheckCircle className="w-4 h-4" /> Оплачен
                        </span>
                      )}
                      {payment.status === "pending" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FFD700]/20 text-[#FFD700] text-sm font-nekstmedium">
                          <Loader2 className="w-4 h-4 animate-spin" /> Ожидает
                        </span>
                      )}
                      {payment.status === "failed" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FF3A3A]/20 text-[#FF3A3A] text-sm font-nekstmedium">
                          <XCircle className="w-4 h-4" /> Ошибка
                        </span>
                      )}
                      {payment.status === "overdue" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FF6B35]/20 text-[#FF6B35] text-sm font-nekstmedium">
                          <AlertCircle className="w-4 h-4" /> Просрочено
                        </span>
                      )}
                      {payment.status === "overdue" && (
                        <span className="text-xs text-[#FF6B35]">
                          {getDaysOverdue(payment.dueDate)} дн.
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {payment.status === "pending" && (
                        <button
                          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium shadow hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition text-sm"
                          onClick={() => handlePay(payment.id)}
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                          Оплатить
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#232136] text-[#BFAAFF] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition shadow text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Детали
                      </button>
                      <div className="relative group">
                        <button className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#232136] text-[#BFAAFF] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition shadow text-sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-[#232136] border border-[#8C7FF5] rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-2">
                            <button className="w-full text-left px-4 py-2 hover:bg-[#404040] transition text-[#BFAAFF] flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Скачать чек
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-[#404040] transition text-[#BFAAFF] flex items-center gap-2">
                              <Copy className="w-4 h-4" />
                              Копировать
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-[#404040] transition text-[#BFAAFF] flex items-center gap-2">
                              <Edit className="w-4 h-4" />
                              Редактировать
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-[#404040] transition text-[#BFAAFF] flex items-center gap-2">
                              <Send className="w-4 h-4" />
                              Отправить клиенту
                            </button>
                            <button className="w-full text-left px-4 py-2 hover:bg-[#404040] transition text-[#BFAAFF] flex items-center gap-2">
                              <Printer className="w-4 h-4" />
                              Печать
                            </button>
                            <hr className="my-2 border-[#8C7FF5]" />
                            <button className="w-full text-left px-4 py-2 hover:bg-[#404040] transition text-[#FF3A3A] flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedPayments.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="py-12 text-center text-[#BFAAFF] text-lg"
                  >
                    {filteredPayments.length === 0
                      ? "Платежи не найдены"
                      : "Счетов и платежей пока нет."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] border border-[#232136] rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <span className="text-[#BFAAFF] text-sm">
                Страница {currentPage} из {totalPages}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#232136] text-[#BFAAFF] border border-[#8C7FF5] hover:bg-[#404040] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Назад
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl font-nekstmedium transition ${
                        pageNum === currentPage
                          ? "bg-[#8C7FF5] text-[#232136]"
                          : "bg-[#232136] text-[#BFAAFF] border border-[#8C7FF5] hover:bg-[#404040]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#232136] text-[#BFAAFF] border border-[#8C7FF5] hover:bg-[#404040] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперёд
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* New Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#232323] rounded-3xl p-8 max-w-md w-full border border-[#232136]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-nekstmedium text-white">
                Новый платёж
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-[#404040] rounded-xl transition"
              >
                <X className="w-5 h-5 text-[#BFAAFF]" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center gap-3 p-6 bg-[#232136] rounded-2xl border border-[#8C7FF5] hover:bg-[#404040] transition">
                  <Receipt className="w-8 h-8 text-[#8C7FF5]" />
                  <span className="text-white font-nekstmedium">
                    Создать счёт
                  </span>
                  <span className="text-[#BFAAFF] text-sm text-center">
                    Выставить счёт клиенту
                  </span>
                </button>

                <button className="flex flex-col items-center gap-3 p-6 bg-[#232136] rounded-2xl border border-[#8C7FF5] hover:bg-[#404040] transition">
                  <Wallet className="w-8 h-8 text-[#8C7FF5]" />
                  <span className="text-white font-nekstmedium">
                    Пополнить баланс
                  </span>
                  <span className="text-[#BFAAFF] text-sm text-center">
                    Внести средства на счёт
                  </span>
                </button>
              </div>

              <div className="pt-4">
                <button className="w-full flex items-center justify-center gap-2 p-4 bg-[#232136] rounded-2xl border border-[#8C7FF5] hover:bg-[#404040] transition">
                  <ArrowUpRight className="w-5 h-5 text-[#8C7FF5]" />
                  <span className="text-white font-nekstmedium">
                    Быстрая оплата
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .animate-fade-in {
            animation: fade-in 0.35s cubic-bezier(.77,0,.175,1);
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}
