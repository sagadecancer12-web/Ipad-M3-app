import { useAppStore } from '../core/stores/app.store';

import { DashboardView } from './dashboard/DashboardView';
import { NotesView } from './notes/NotesView';

import { AIChatView } from './ai-chat/AIChatView';
import { GraphView } from './graph/GraphView';
import { FlashcardsView } from './flashcards/FlashcardsView';
import { EgelView } from './egel/EgelView';
import { PromptsView } from './prompts/PromptsView';
import { SearchView } from './search/SearchView';
import { DailyView } from './daily/DailyView';
import { MocView } from './moc/MocView';
import { PdfView } from './pdf/PdfView';
import { SyncView } from './sync/SyncView';

import PDFUploader from '@/features/pdf/components/PDFUploader';
import PDFLibrary from '@/features/pdf/components/PDFLibrary';
import QuestionCard from '@/features/simulator/components/QuestionCard';


export function ViewRouter() {
  const { currentView } = useAppStore();

  if (currentView === 'split') {
    return (
      <div className="split">
        <div className="split-panel" style={{ flex: '0 0 55%' }}>
          <NotesView />
        </div>
        <div className="split-panel" style={{ flex: '0 0 45%' }}>
          <AIChatView />
        </div>
      </div>
    );
  }

    switch (currentView) {

      case 'dashboard':
        return <DashboardView />;
    
      case 'notes':
        return <NotesView />;
    
      case 'daily':
        return <DailyView />;
    
      case 'moc':
        return <MocView />;
    
      case 'search':
        return <SearchView />;
    
      case 'ai':
        return <AIChatView />;
    
      case 'graph':
        return <GraphView />;
    
      case 'flash':
        return <FlashcardsView />;
    
      case 'egel':
        return <EgelView />;
    
      case 'pdf':
        return <PdfView />;
    
      case 'prompts':
        return <PromptsView />;
    
      case 'sync':
        return <SyncView />;
    
      default:
        return <DashboardView />;
    }
