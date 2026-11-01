import { useState } from 'react';
import { useProductView } from '../../app/providers/ProductProvider.jsx';
import { overviewPreset } from '../dashboard/overview-report.js';
import useAssistantConversation from './useAssistantConversation.js';
export default function useConnectedAssistant(open = true) {
  const { preview, workspace, language, dashboard } = useProductView();
  const [filters, setFilters] = useState(() => ({ branch: 'all', ...overviewPreset('30') }));
  const [dateOpen, setDateOpen] = useState(false);
  const scope = dashboard || { filters, setFilters, openDate: () => setDateOpen(true) };
  const conversation = useAssistantConversation({
    enabled: !preview && open,
    workspaceId: workspace?.id,
    locale: language,
    filters: scope.filters,
  });
  return {
    ...conversation,
    scope,
    dateOpen,
    setDateOpen,
    branches: conversation.context?.branches || workspace?.branches || [],
  };
}
