import React from 'react';
import Assistant from '../../features/ai-analysis/preview/Assistant.jsx';

// Preserve the reviewed illustrative panel; this does not call an AI backend.
export default function ConnectedAssistantLauncher() {
  return <Assistant presentationOnly />;
}
