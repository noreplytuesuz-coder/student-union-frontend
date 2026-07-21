import { useLanguage } from '@/app/providers';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  Search,
  File,
  FileType2,
  FileSpreadsheet,
  Folder,
  X,
  Eye,
} from 'lucide-react';
import { Card, Button, Skeleton } from '@/shared/ui';
import { getImageUrl } from '@/shared/lib/utils';
import { useDocuments, Doc } from '@/entities/document';

const getFileIcon = (url: string) => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  switch (ext) {
    case 'pdf':
      return <FileText size={24} className="text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileType2 size={24} className="text-blue-500" />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileSpreadsheet size={24} className="text-green-500" />;
    default:
      return <File size={24} className="text-gray-500" />;
  }
};

const isPreviewable = (url: string) => {
  const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext);
};

export function Documents() {
  const { t } = useLanguage();
  const { data, isLoading, isError } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState<Doc | null>(null);

  const filtered = (data ?? []).filter((doc) => {
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12">
      {/* Header & Search */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Folder size={20} />
            </div>
            <span className="font-heading font-bold text-primary uppercase tracking-widest text-sm">
              {t('Resources')}
            </span>
          </motion.div>
          <h1 className="font-display text-5xl sm:text-7xl font-black uppercase tracking-tight">
            {t('Important')} <span className="text-gradient">{t('Documents')}</span>
          </h1>
        </div>

        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder={t('Search documents...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 neo-border focus:outline-none focus:ring-2 focus:ring-primary transition-all font-sans"
          />
        </div>
      </section>

      {/* Document Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 flex flex-col gap-4" neo={false}>
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-9 w-full rounded-lg" />
            </Card>
          ))
        ) : isError ? (
          <div className="col-span-full py-20 text-center text-muted-foreground font-sans">
            {t('Failed to load documents. Please try again later.')}
          </div>
        ) : filtered.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filtered.map((doc, i) => {
              const url = getImageUrl(doc.file) ?? doc.file;
              return (
                <motion.div
                  key={doc._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card className="p-6 h-full flex flex-col group neo-border hover:border-primary transition-colors" neo={false}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center neo-border flex-shrink-0">
                        {getFileIcon(doc.file)}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                          {doc.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm font-sans mb-6 line-clamp-3 flex-1">
                      {doc.description}
                    </p>

                    <div className="flex gap-2 mt-auto">
                      <a
                        href={url}
                        download
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-hero text-white font-heading font-bold text-sm hover:opacity-90 transition-opacity neo-shadow"
                      >
                        <Download size={16} />
                        {t('Download')}
                      </a>
                      {isPreviewable(doc.file) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <Eye size={16} />
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <FileText size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-muted-foreground font-sans">{t('No documents found.')}</p>
          </div>
        )}
      </section>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6"
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[var(--bg-color)] rounded-3xl neo-border shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewDoc(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-primary transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-white/10">
                {getFileIcon(previewDoc.file)}
                <h2 className="font-display text-2xl font-bold">{previewDoc.title}</h2>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={getImageUrl(previewDoc.file) ?? previewDoc.file}
                  title={previewDoc.title}
                  className="w-full h-[70vh] border-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
