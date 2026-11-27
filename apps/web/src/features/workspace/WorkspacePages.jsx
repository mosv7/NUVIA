import { useAuth } from '../../app/providers/AuthProvider.jsx';
import { lazy } from 'react';
import PreviewWorkspaceContext from '../insights/PreviewWorkspaceContext.jsx';

import OverviewEmpty from '../dashboard/OverviewEmpty.jsx';

import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/manrope/800.css';
import '@fontsource/noto-sans-arabic/500.css';
import '@fontsource/noto-sans-arabic/700.css';
import ReferenceFrame from '../insights/ReferenceFrame.jsx';

import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/noto-sans-arabic/400.css';
import '@fontsource/noto-sans-arabic/600.css';
import '../../components/layout/workspace.css';
import useWorkspaceModel from './useWorkspaceModel.jsx';
import { I } from './WorkspacePrimitives.jsx';
import { navigation } from './workspace-data.js';
import renderBusinessPages from './BusinessPages.jsx';
import renderAccountPages from './AccountPages.jsx';
import renderNotificationPages from './NotificationPages.jsx';
import renderSecurityPages from './SecurityPages.jsx';
import renderWorkspaceStates from './WorkspaceStates.jsx';
import applyWorkspaceOverrides from './WorkspaceOverrides.jsx';
import WorkspaceDialogs from './WorkspaceDialogs.jsx';
import ConnectedWorkspaceData from './ConnectedWorkspaceData.jsx';
const ReferenceAction = lazy(() => import('../feedback/ActionEvidencePage.jsx'));
const ReferenceAnalytics = lazy(() => import('../analytics/preview/AnalyticsPage.jsx'));
const ReferenceReports = lazy(() => import('../reports/preview/ExtraPreviewPage.jsx'));
const ReferenceSurveys = lazy(() => import('../surveys/preview/SurveyPage.jsx'));
const ReferenceDashboard = lazy(() => import('../dashboard/DashboardPage.jsx'));
const ReferenceFeedbacks = lazy(() => import('../feedback/FeedbacksPage.jsx'));
export default function WorkspacePages({ language, setLanguage }) {
  const auth = useAuth();
  const model = useWorkspaceModel({ language, setLanguage });
  const {
    L,
    biz,
    branches,
    businessPage,
    go,
    heading,
    lang,
    otherBusinesses,
    page,
    sample,
    setBiz,
    setBranches,
    setLang,
    setOtherBusinesses,
    setToast,
    settingsPage,
    settingsLoading,
    settingsLoadFailed,
    toast,
  } = model;
  let content =
    renderBusinessPages(model) ??
    renderAccountPages(model) ??
    renderNotificationPages(model) ??
    renderSecurityPages(model) ??
    renderWorkspaceStates(model);
  content = applyWorkspaceOverrides(model, content);
  return (
    <PreviewWorkspaceContext.Provider
      value={{
        biz,
        otherBusinesses,
        switchBusiness: (next) => {
          setOtherBusinesses((prev) => [
            ...prev.filter((b) => b.name !== next.name),
            { ...biz, branches: [...branches] },
          ]);
          setBiz({ name: next.name, industry: next.industry });
          setBranches(next.branches || []);
          go('business');
        },
      }}
    >
      <div
        style={{ display: 'contents' }}
        onClickCapture={(event) => {
          if (auth.preview) return;
          const button = event.target.closest('button');
          if (!button) return;
          const unsupported = page === 'business-add' && button.classList.contains('primary');
          if (unsupported) {
            event.preventDefault();
            event.stopPropagation();
            setToast(
              lang === 'ar' ? 'هذه الميزة غير متاحة بعد.' : 'This feature is not available yet.',
            );
          }
        }}
      >
        {!auth.preview && (page === 'surveys' || page.startsWith('survey-')) ? (
          <ReferenceFrame page={page} title="Surveys" language={lang} setLanguage={setLang}>
            <ConnectedWorkspaceData type="surveys" language={lang} />
          </ReferenceFrame>
        ) : !auth.preview && page.startsWith('analytics') ? (
          <ReferenceFrame page={page} title="Analytics" language={lang} setLanguage={setLang}>
            <ConnectedWorkspaceData type="analytics" language={lang} />
          </ReferenceFrame>
        ) : !auth.preview && page === 'report-details' ? (
          <ReferenceFrame page={page} title="Report details" language={lang} setLanguage={setLang}>
            <ConnectedWorkspaceData type="report-details" language={lang} />
          </ReferenceFrame>
        ) : !auth.preview && page === 'reports' ? (
          <ReferenceFrame page={page} title="Reports" language={lang} setLanguage={setLang}>
            <ConnectedWorkspaceData type="reports" language={lang} />
          </ReferenceFrame>
        ) : !auth.preview && page === 'feedbacks' ? (
          <ReferenceFrame page={page} title="Feedbacks" language={lang} setLanguage={setLang}>
            <ConnectedWorkspaceData type="feedbacks" language={lang} />
          </ReferenceFrame>
        ) : ['action-board', 'evidence'].includes(page) ? (
          <ReferenceAction
            preview={auth.preview}
            workspace={auth.workspace}
            onLogout={auth.logout}
            page={page}
            language={lang}
            setLanguage={setLang}
          />
        ) : page === 'feedback-details' ? (
          <ReferenceFeedbacks
            preview={auth.preview}
            workspace={auth.workspace}
            onLogout={auth.logout}
            page="feedback-details"
            language={lang}
            setLanguage={setLang}
          />
        ) : page === 'assistant' || page === 'report-details' || (sample && page === 'reports') ? (
          <ReferenceReports
            preview={auth.preview}
            workspace={auth.workspace}
            onLogout={auth.logout}
            page={page === 'assistant' ? 'nuvia-assistant' : page}
            language={lang}
            setLanguage={setLang}
          />
        ) : page.startsWith('survey-') || page === 'surveys' ? (
          <ReferenceSurveys
            preview={auth.preview}
            workspace={auth.workspace}
            onLogout={auth.logout}
            page={page === 'surveys' ? (sample ? 'survey-all' : 'survey-empty') : page}
            language={lang}
            setLanguage={setLang}
          />
        ) : sample && page === 'analytics' ? (
          <ReferenceAnalytics
            preview={auth.preview}
            workspace={auth.workspace}
            onLogout={auth.logout}
            page={
              location.hash.slice(2).split('?')[0].startsWith('analytics-')
                ? location.hash.slice(2).split('?')[0]
                : 'analytics-sentiment'
            }
            language={lang}
            setLanguage={setLang}
          />
        ) : page === 'overview' ? (
          !auth.preview ? (
            <ReferenceFrame page="overview" title="Overview" language={lang} setLanguage={setLang}>
              <ConnectedWorkspaceData type="analytics" language={lang} />
            </ReferenceFrame>
          ) : sample ? (
            <ReferenceDashboard
              preview={auth.preview}
              workspace={auth.workspace}
              onLogout={auth.logout}
              language={lang}
              setLanguage={setLang}
            />
          ) : (
            <ReferenceFrame page="overview" title="Overview" language={lang} setLanguage={setLang}>
              {heading(
                'Overview',
                L(
                  'Welcome back, Sara. Track your customer feedback here.',
                  'مرحبًا سارة. تابعي آراء عملائك هنا.',
                ),
              )}
              <div className="ds-overview">
                <OverviewEmpty />
              </div>
            </ReferenceFrame>
          )
        ) : page.startsWith('feedbacks-') ? (
          <ReferenceFeedbacks
            preview={auth.preview}
            workspace={auth.workspace}
            onLogout={auth.logout}
            page={page}
            language={lang}
            setLanguage={setLang}
          />
        ) : page === 'feedbacks' ? (
          <ReferenceFeedbacks
            preview={auth.preview}
            workspace={auth.workspace}
            onLogout={auth.logout}
            page={sample ? 'feedbacks' : 'feedbacks-empty'}
            language={lang}
            setLanguage={setLang}
          />
        ) : (
          <ReferenceFrame
            page={page}
            language={lang}
            setLanguage={setLang}
            title={
              businessPage
                ? 'Business'
                : settingsPage
                  ? 'Settings'
                  : (page === 'subscription'
                      ? 'Subscription'
                      : navigation.find((n) => n[1] === page)?.[0]) || 'Notifications'
            }
          >
            {settingsLoading && (
              <p role="status">{L('Loading settings…', 'جارٍ تحميل الإعدادات…')}</p>
            )}
            {settingsLoadFailed && (
              <p role="alert">{L('Could not load settings.', 'تعذر تحميل الإعدادات.')}</p>
            )}
            {content}
          </ReferenceFrame>
        )}
        {toast && (
          <div className="toast" role="status">
            <I name="check" />
            {toast}
            <button className="icon-button" aria-label="Dismiss" onClick={() => setToast('')}>
              <I name="close" size={16} />
            </button>
          </div>
        )}
        {<WorkspaceDialogs model={model} />}
      </div>
    </PreviewWorkspaceContext.Provider>
  );
}
