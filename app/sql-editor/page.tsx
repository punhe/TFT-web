'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    Card,
    CardBody,
    Button,
    Tabs,
    Tab,
    Input,
    Textarea,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Chip,
    Spinner,
    Divider,
    Tooltip,
    useDisclosure,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@heroui/react';
import { m, AnimatePresence } from 'framer-motion';
import {
    FiPlay,
    FiSave,
    FiCopy,
    FiTrash2,
    FiClock,
    FiDatabase,
    FiCheckCircle,
    FiXCircle,
    FiCode,
    FiBookOpen,
    FiStar,
    FiFolder,
    FiSearch,
    FiPlus,
    FiEdit3,
    FiDownload,
    FiRefreshCw,
    FiChevronDown,
    FiHash,
    FiList,
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { SQL_TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/sql-templates';

// Types
interface QueryResult {
    ok: boolean;
    columns?: string[];
    rows?: Record<string, unknown>[];
    rowCount?: number;
    runtimeMs?: number;
    appliedLimit?: number;
    error?: {
        message: string;
        code: string;
    };
}

interface SavedQuery {
    id: string;
    title: string;
    description: string | null;
    sql: string;
    tags: string[];
    is_favorite: boolean;
    folder: string | null;
    created_at: string;
    updated_at: string;
}

interface QueryRun {
    id: string;
    sql: string;
    status: 'success' | 'error';
    error_message: string | null;
    row_count: number | null;
    runtime_ms: number | null;
    created_at: string;
    saved_query_id: string | null;
}

export default function SqlEditorPage() {
    const { session, user } = useAuth();

    // Editor state
    const [sql, setSql] = useState('SELECT * FROM sample_products LIMIT 10;');
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<QueryResult | null>(null);
    const [activeTab, setActiveTab] = useState('results');

    // Saved queries state
    const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
    const [loadingSavedQueries, setLoadingSavedQueries] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterFavorites, setFilterFavorites] = useState(false);
    const [filterFolder, setFilterFolder] = useState<string | null>(null);

    // History state
    const [history, setHistory] = useState<QueryRun[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Modal states
    const saveModal = useDisclosure();
    const templateModal = useDisclosure();
    const [saveTitle, setSaveTitle] = useState('');
    const [saveDescription, setSaveDescription] = useState('');
    const [saveTags, setSaveTags] = useState('');
    const [saveFolder, setSaveFolder] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [editingQuery, setEditingQuery] = useState<SavedQuery | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Show toast notification
    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    // Fetch saved queries
    const fetchSavedQueries = useCallback(async () => {
        if (!user) return;

        try {
            setLoadingSavedQueries(true);
            let query = supabaseBrowser
                .from('saved_queries')
                .select('*')
                .order('updated_at', { ascending: false });

            if (searchQuery) {
                query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
            }

            if (filterFavorites) {
                query = query.eq('is_favorite', true);
            }

            if (filterFolder) {
                query = query.eq('folder', filterFolder);
            }

            const { data, error } = await query;

            if (error) throw error;
            setSavedQueries(data || []);
        } catch (error) {
            console.error('Error fetching saved queries:', error);
            showToast('Failed to load saved queries', 'error');
        } finally {
            setLoadingSavedQueries(false);
        }
    }, [user, searchQuery, filterFavorites, filterFolder, showToast]);

    // Fetch history
    const fetchHistory = useCallback(async () => {
        if (!user) return;

        try {
            setLoadingHistory(true);
            const { data, error } = await supabaseBrowser
                .from('query_runs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setHistory(data || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoadingHistory(false);
        }
    }, [user]);

    // Load data on mount
    useEffect(() => {
        if (user) {
            fetchSavedQueries();
            fetchHistory();
        }
    }, [user, fetchSavedQueries, fetchHistory]);

    // Record query run
    const recordRun = useCallback(async (
        sqlText: string,
        status: 'success' | 'error',
        errorMessage?: string,
        rowCount?: number,
        runtimeMs?: number,
        savedQueryId?: string
    ) => {
        if (!user) return;

        try {
            await supabaseBrowser.from('query_runs').insert({
                user_id: user.id,
                sql: sqlText,
                status,
                error_message: errorMessage || null,
                row_count: rowCount || null,
                runtime_ms: runtimeMs || null,
                saved_query_id: savedQueryId || null,
            });

            // Refresh history
            fetchHistory();
        } catch (error) {
            console.error('Error recording run:', error);
        }
    }, [user, fetchHistory]);

    // Run query
    const runQuery = useCallback(async () => {
        if (!sql.trim() || !session?.access_token) {
            showToast('Please enter a SQL query', 'error');
            return;
        }

        setIsRunning(true);
        setResult(null);
        setActiveTab('results');

        try {
            const response = await fetch('/api/run-query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ sql: sql.trim() }),
            });

            const data: QueryResult = await response.json();
            setResult(data);

            // Record the run
            await recordRun(
                sql.trim(),
                data.ok ? 'success' : 'error',
                data.error?.message,
                data.rowCount,
                data.runtimeMs
            );

            if (data.ok) {
                showToast(`Query completed in ${data.runtimeMs}ms (${data.rowCount} rows)`, 'success');
            } else {
                setActiveTab('error');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Query execution failed';
            setResult({
                ok: false,
                error: { message: errorMessage, code: 'NETWORK_ERROR' }
            });
            setActiveTab('error');

            await recordRun(sql.trim(), 'error', errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setIsRunning(false);
        }
    }, [sql, session, recordRun, showToast]);

    // Keyboard shortcut for running query
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runQuery();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [runQuery]);

    // Save query
    const saveQuery = useCallback(async () => {
        if (!user || !saveTitle.trim()) {
            showToast('Please enter a title', 'error');
            return;
        }

        setIsSaving(true);

        try {
            const queryData = {
                user_id: user.id,
                title: saveTitle.trim(),
                description: saveDescription.trim() || null,
                sql: sql.trim(),
                tags: saveTags.split(',').map(t => t.trim()).filter(Boolean),
                is_favorite: isFavorite,
                folder: saveFolder.trim() || null,
            };

            if (editingQuery) {
                // Update existing
                const { error } = await supabaseBrowser
                    .from('saved_queries')
                    .update(queryData)
                    .eq('id', editingQuery.id);

                if (error) throw error;
                showToast('Query updated successfully', 'success');
            } else {
                // Create new
                const { error } = await supabaseBrowser
                    .from('saved_queries')
                    .insert(queryData);

                if (error) throw error;
                showToast('Query saved successfully', 'success');
            }

            saveModal.onClose();
            resetSaveForm();
            fetchSavedQueries();
        } catch (error) {
            console.error('Error saving query:', error);
            showToast('Failed to save query', 'error');
        } finally {
            setIsSaving(false);
        }
    }, [user, saveTitle, saveDescription, sql, saveTags, isFavorite, saveFolder, editingQuery, saveModal, fetchSavedQueries, showToast]);

    // Reset save form
    const resetSaveForm = () => {
        setSaveTitle('');
        setSaveDescription('');
        setSaveTags('');
        setSaveFolder('');
        setIsFavorite(false);
        setEditingQuery(null);
    };

    // Open save modal
    const openSaveModal = (query?: SavedQuery) => {
        if (query) {
            setEditingQuery(query);
            setSaveTitle(query.title);
            setSaveDescription(query.description || '');
            setSaveTags(query.tags.join(', '));
            setSaveFolder(query.folder || '');
            setIsFavorite(query.is_favorite);
            setSql(query.sql);
        } else {
            resetSaveForm();
        }
        saveModal.onOpen();
    };

    // Delete saved query
    const deleteQuery = useCallback(async (id: string) => {
        if (!confirm('Are you sure you want to delete this query?')) return;

        try {
            const { error } = await supabaseBrowser
                .from('saved_queries')
                .delete()
                .eq('id', id);

            if (error) throw error;
            showToast('Query deleted', 'success');
            fetchSavedQueries();
        } catch (error) {
            console.error('Error deleting query:', error);
            showToast('Failed to delete query', 'error');
        }
    }, [fetchSavedQueries, showToast]);

    // Toggle favorite
    const toggleFavorite = useCallback(async (query: SavedQuery) => {
        try {
            const { error } = await supabaseBrowser
                .from('saved_queries')
                .update({ is_favorite: !query.is_favorite })
                .eq('id', query.id);

            if (error) throw error;
            fetchSavedQueries();
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    }, [fetchSavedQueries]);

    // Load query into editor
    const loadQuery = (queryText: string) => {
        setSql(queryText);
        textareaRef.current?.focus();
    };

    // Get unique folders
    const folders = [...new Set(savedQueries.map(q => q.folder).filter(Boolean))] as string[];

    // Format date
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
            {/* Toast notification */}
            <AnimatePresence>
                {toast && (
                    <m.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className={`fixed top-20 left-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 ${toast.type === 'success'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-red-500 text-white'
                            }`}
                    >
                        {toast.type === 'success' ? <FiCheckCircle /> : <FiXCircle />}
                        {toast.message}
                    </m.div>
                )}
            </AnimatePresence>

            <div className="flex h-[calc(100vh-5rem)]">
                {/* Left Sidebar - Saved Queries */}
                <m.aside
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-80 border-r border-gray-200/50 bg-white/60 backdrop-blur-xl p-4 overflow-y-auto"
                >
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                            <FiFolder className="text-primary" />
                            My Queries
                        </h2>

                        {/* Search */}
                        <Input
                            placeholder="Search queries..."
                            size="sm"
                            startContent={<FiSearch className="text-gray-400" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            classNames={{
                                inputWrapper: "bg-white/80 border-gray-200",
                            }}
                        />

                        {/* Filters */}
                        <div className="flex gap-2 mt-2">
                            <Button
                                size="sm"
                                variant={filterFavorites ? "solid" : "flat"}
                                color={filterFavorites ? "warning" : "default"}
                                className="flex-1"
                                startContent={<FiStar size={14} />}
                                onPress={() => setFilterFavorites(!filterFavorites)}
                            >
                                Favorites
                            </Button>

                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        size="sm"
                                        variant={filterFolder ? "solid" : "flat"}
                                        color={filterFolder ? "primary" : "default"}
                                        className="flex-1"
                                        endContent={<FiChevronDown size={14} />}
                                    >
                                        {filterFolder || 'Folder'}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Filter by folder"
                                    onAction={(key) => setFilterFolder(key === 'all' ? null : String(key))}
                                    items={[{ key: 'all', label: 'All Folders' }, ...folders.map(f => ({ key: f, label: f }))]}
                                >
                                    {(item: { key: string; label: string }) => (
                                        <DropdownItem key={item.key}>{item.label}</DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>

                    <Divider className="my-3" />

                    {/* Query list */}
                    <div className="space-y-2">
                        {loadingSavedQueries ? (
                            <div className="flex justify-center py-8">
                                <Spinner size="sm" />
                            </div>
                        ) : savedQueries.length === 0 ? (
                            <p className="text-center text-gray-500 py-8 text-sm">
                                {searchQuery || filterFavorites || filterFolder
                                    ? 'No matching queries found'
                                    : 'No saved queries yet'}
                            </p>
                        ) : (
                            savedQueries.map((query) => (
                                <m.div
                                    key={query.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-3 rounded-xl bg-white/80 border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => loadQuery(query.sql)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-gray-900 truncate text-sm">
                                                    {query.title}
                                                </h3>
                                                {query.is_favorite && (
                                                    <FiStar className="text-yellow-400 fill-yellow-400" size={12} />
                                                )}
                                            </div>
                                            {query.description && (
                                                <p className="text-xs text-gray-500 truncate mt-0.5">
                                                    {query.description}
                                                </p>
                                            )}
                                            {query.tags.length > 0 && (
                                                <div className="flex gap-1 mt-1.5 flex-wrap">
                                                    {query.tags.slice(0, 2).map((tag) => (
                                                        <Chip key={tag} size="sm" variant="flat" className="h-5 text-xs">
                                                            {tag}
                                                        </Chip>
                                                    ))}
                                                    {query.tags.length > 2 && (
                                                        <Chip size="sm" variant="flat" className="h-5 text-xs">
                                                            +{query.tags.length - 2}
                                                        </Chip>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                            <Tooltip content="Toggle favorite">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => toggleFavorite(query)}
                                                >
                                                    <FiStar
                                                        size={14}
                                                        className={query.is_favorite ? 'text-yellow-400 fill-yellow-400' : ''}
                                                    />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Edit">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    onPress={() => openSaveModal(query)}
                                                >
                                                    <FiEdit3 size={14} />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Delete">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="danger"
                                                    onPress={() => deleteQuery(query.id)}
                                                >
                                                    <FiTrash2 size={14} />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </m.div>
                            ))
                        )}
                    </div>

                    <Divider className="my-4" />

                    {/* Templates section */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                            <FiBookOpen className="text-secondary" />
                            SQL Templates
                        </h3>
                        <Button
                            variant="flat"
                            color="secondary"
                            className="w-full"
                            startContent={<FiCode />}
                            onPress={templateModal.onOpen}
                        >
                            Browse Templates
                        </Button>
                    </div>
                </m.aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col p-4 overflow-hidden">
                    {/* Editor Section */}
                    <m.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                    >
                        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl mb-4">
                            <CardBody className="p-4">
                                {/* Toolbar */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <FiDatabase className="text-primary" />
                                        <span className="font-semibold text-gray-700">SQL Editor</span>
                                        <Chip size="sm" variant="flat" color="default" className="text-xs">
                                            PostgreSQL
                                        </Chip>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Tooltip content="Clear editor">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                onPress={() => setSql('')}
                                            >
                                                <FiTrash2 size={16} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content="Copy query">
                                            <Button
                                                isIconOnly
                                                variant="light"
                                                size="sm"
                                                onPress={() => {
                                                    navigator.clipboard.writeText(sql);
                                                    showToast('Copied to clipboard', 'success');
                                                }}
                                            >
                                                <FiCopy size={16} />
                                            </Button>
                                        </Tooltip>

                                        <Button
                                            variant="flat"
                                            color="primary"
                                            size="sm"
                                            startContent={<FiSave size={16} />}
                                            onPress={() => openSaveModal()}
                                        >
                                            Save
                                        </Button>

                                        <Button
                                            color="primary"
                                            size="sm"
                                            isLoading={isRunning}
                                            startContent={!isRunning && <FiPlay size={16} />}
                                            onPress={runQuery}
                                            className="bg-gradient-to-r from-primary to-secondary font-semibold shadow-md"
                                        >
                                            {isRunning ? 'Running...' : 'Run'}
                                        </Button>
                                    </div>
                                </div>

                                {/* SQL Textarea */}
                                <Textarea
                                    ref={textareaRef}
                                    value={sql}
                                    onChange={(e) => setSql(e.target.value)}
                                    placeholder="Enter your SQL query here... (Ctrl/Cmd + Enter to run)"
                                    minRows={6}
                                    maxRows={12}
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: "bg-slate-900/95 border-slate-700 hover:border-primary",
                                        input: "text-green-400 font-mono text-sm placeholder:text-slate-500",
                                    }}
                                />

                                <p className="text-xs text-gray-500 mt-2">
                                    💡 Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-mono text-xs">Enter</kbd> to run query
                                </p>
                            </CardBody>
                        </Card>
                    </m.div>

                    {/* Results Section */}
                    <m.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex-1 overflow-hidden"
                    >
                        <Card className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl h-full">
                            <CardBody className="p-0 flex flex-col h-full">
                                <Tabs
                                    selectedKey={activeTab}
                                    onSelectionChange={(key) => setActiveTab(String(key))}
                                    variant="underlined"
                                    classNames={{
                                        tabList: "px-4 pt-2",
                                        cursor: "bg-gradient-to-r from-primary to-secondary",
                                    }}
                                >
                                    <Tab
                                        key="results"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <FiList size={14} />
                                                Results
                                                {result?.ok && (
                                                    <Chip size="sm" variant="flat" color="success" className="h-5 text-xs">
                                                        {result.rowCount}
                                                    </Chip>
                                                )}
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="error"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <FiXCircle size={14} />
                                                Error
                                                {result && !result.ok && (
                                                    <Chip size="sm" variant="flat" color="danger" className="h-5">
                                                        !
                                                    </Chip>
                                                )}
                                            </div>
                                        }
                                    />
                                    <Tab
                                        key="history"
                                        title={
                                            <div className="flex items-center gap-2">
                                                <FiClock size={14} />
                                                History
                                            </div>
                                        }
                                    />
                                </Tabs>

                                <Divider />

                                <div className="flex-1 overflow-auto p-4">
                                    {activeTab === 'results' && (
                                        <>
                                            {isRunning ? (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <Spinner size="lg" color="primary" />
                                                    <p className="mt-4 text-gray-500">Executing query...</p>
                                                </div>
                                            ) : result?.ok && result.rows ? (
                                                <>
                                                    {/* Result stats */}
                                                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <FiHash size={14} />
                                                            {result.rowCount} rows
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FiClock size={14} />
                                                            {result.runtimeMs}ms
                                                        </span>
                                                        {result.appliedLimit && result.rowCount === result.appliedLimit && (
                                                            <Chip size="sm" variant="flat" color="warning" className="h-5 text-xs">
                                                                Limited to {result.appliedLimit}
                                                            </Chip>
                                                        )}
                                                    </div>

                                                    {/* Results table */}
                                                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                                                        <table className="w-full text-sm">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    {result.columns?.map((col) => (
                                                                        <th
                                                                            key={col}
                                                                            className="px-4 py-3 text-left font-semibold text-gray-700 border-b"
                                                                        >
                                                                            {col}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {result.rows.map((row, i) => (
                                                                    <tr
                                                                        key={i}
                                                                        className="hover:bg-blue-50/50 transition-colors"
                                                                    >
                                                                        {result.columns?.map((col) => (
                                                                            <td
                                                                                key={col}
                                                                                className="px-4 py-2 border-b border-gray-100 text-gray-600"
                                                                            >
                                                                                {row[col] === null ? (
                                                                                    <span className="text-gray-400 italic">null</span>
                                                                                ) : typeof row[col] === 'object' ? (
                                                                                    JSON.stringify(row[col])
                                                                                ) : (
                                                                                    String(row[col])
                                                                                )}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                    <FiDatabase size={48} className="mb-4 opacity-50" />
                                                    <p>Run a query to see results</p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {activeTab === 'error' && (
                                        <>
                                            {result && !result.ok ? (
                                                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                                                    <div className="flex items-start gap-3">
                                                        <FiXCircle className="text-red-500 mt-0.5" size={20} />
                                                        <div>
                                                            <h4 className="font-semibold text-red-700 mb-1">
                                                                {result.error?.code || 'Error'}
                                                            </h4>
                                                            <p className="text-red-600 font-mono text-sm">
                                                                {result.error?.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                    <FiCheckCircle size={48} className="mb-4 text-green-400" />
                                                    <p>No errors</p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {activeTab === 'history' && (
                                        <>
                                            {loadingHistory ? (
                                                <div className="flex justify-center py-8">
                                                    <Spinner size="sm" />
                                                </div>
                                            ) : history.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                                    <FiClock size={48} className="mb-4 opacity-50" />
                                                    <p>No query history yet</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {history.map((run) => (
                                                        <div
                                                            key={run.id}
                                                            className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                                                            onClick={() => loadQuery(run.sql)}
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        {run.status === 'success' ? (
                                                                            <FiCheckCircle className="text-green-500" size={14} />
                                                                        ) : (
                                                                            <FiXCircle className="text-red-500" size={14} />
                                                                        )}
                                                                        <span className="text-xs text-gray-500">
                                                                            {formatDate(run.created_at)}
                                                                        </span>
                                                                        {run.runtime_ms && (
                                                                            <Chip size="sm" variant="flat" className="h-4 text-xs">
                                                                                {run.runtime_ms}ms
                                                                            </Chip>
                                                                        )}
                                                                        {run.row_count !== null && (
                                                                            <Chip size="sm" variant="flat" color="success" className="h-4 text-xs">
                                                                                {run.row_count} rows
                                                                            </Chip>
                                                                        )}
                                                                    </div>
                                                                    <pre className="text-xs text-gray-600 font-mono truncate max-w-md">
                                                                        {run.sql}
                                                                    </pre>
                                                                    {run.error_message && (
                                                                        <p className="text-xs text-red-500 mt-1 truncate">
                                                                            {run.error_message}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div onClick={(e) => e.stopPropagation()}>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="light"
                                                                        isIconOnly
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        onPress={() => loadQuery(run.sql)}
                                                                    >
                                                                        <FiRefreshCw size={14} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </m.div>
                </main>
            </div>

            {/* Save Query Modal */}
            <Modal
                isOpen={saveModal.isOpen}
                onClose={() => {
                    saveModal.onClose();
                    resetSaveForm();
                }}
                size="lg"
            >
                <ModalContent>
                    <ModalHeader>
                        {editingQuery ? 'Edit Query' : 'Save Query'}
                    </ModalHeader>
                    <ModalBody>
                        <div className="space-y-4">
                            <Input
                                label="Title"
                                placeholder="My awesome query"
                                value={saveTitle}
                                onChange={(e) => setSaveTitle(e.target.value)}
                                isRequired
                            />
                            <Textarea
                                label="Description"
                                placeholder="What does this query do?"
                                value={saveDescription}
                                onChange={(e) => setSaveDescription(e.target.value)}
                                minRows={2}
                            />
                            <Input
                                label="Tags"
                                placeholder="tag1, tag2, tag3"
                                value={saveTags}
                                onChange={(e) => setSaveTags(e.target.value)}
                                description="Comma-separated tags"
                            />
                            <Input
                                label="Folder"
                                placeholder="My Folder"
                                value={saveFolder}
                                onChange={(e) => setSaveFolder(e.target.value)}
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={isFavorite ? "solid" : "bordered"}
                                    color={isFavorite ? "warning" : "default"}
                                    onPress={() => setIsFavorite(!isFavorite)}
                                    startContent={<FiStar className={isFavorite ? 'fill-current' : ''} />}
                                >
                                    {isFavorite ? 'Favorited' : 'Add to favorites'}
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={saveModal.onClose}>
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            onPress={saveQuery}
                            isLoading={isSaving}
                            className="bg-gradient-to-r from-primary to-secondary"
                        >
                            {editingQuery ? 'Update' : 'Save'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Templates Modal */}
            <Modal
                isOpen={templateModal.isOpen}
                onClose={templateModal.onClose}
                size="3xl"
                scrollBehavior="inside"
            >
                <ModalContent>
                    <ModalHeader>
                        <div className="flex items-center gap-2">
                            <FiBookOpen className="text-secondary" />
                            SQL Templates
                        </div>
                    </ModalHeader>
                    <ModalBody>
                        {TEMPLATE_CATEGORIES.map((category) => (
                            <div key={category.id} className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span>{category.icon}</span>
                                    {category.label}
                                </h3>
                                <div className="grid gap-3">
                                    {SQL_TEMPLATES
                                        .filter((t) => t.category === category.id)
                                        .map((template) => (
                                            <div
                                                key={template.id}
                                                className="p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-primary/30 transition-all cursor-pointer"
                                                onClick={() => {
                                                    loadQuery(template.sql);
                                                    templateModal.onClose();
                                                }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{template.title}</h4>
                                                        <p className="text-sm text-gray-500 mb-2">{template.description}</p>
                                                        <pre className="text-xs font-mono text-gray-600 bg-white p-2 rounded border max-h-24 overflow-auto">
                                                            {template.sql}
                                                        </pre>
                                                        <p className="text-xs text-gray-400 mt-2 italic">
                                                            💡 {template.explanation}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="flat"
                                                        color="primary"
                                                        onPress={() => {
                                                            loadQuery(template.sql);
                                                            templateModal.onClose();
                                                        }}
                                                    >
                                                        Use
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={templateModal.onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
