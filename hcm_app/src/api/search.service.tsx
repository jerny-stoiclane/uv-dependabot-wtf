import { Avatar as ArmhrAvatar } from '@armhr/ui';
import { ChevronRight, Link as LinkIcon } from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { AxiosInstance } from 'axios';
import Fuse from 'fuse.js';
import { NavigateFunction } from 'react-router-dom';

import { getDisplayName } from '../utils/profile';

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

const highlightText = (text: string, highlight: string) => {
  if (highlight === '') {
    return text;
  }

  const escapedHighlight = escapeRegExp(highlight);
  const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={i} style={{ backgroundColor: '#fff59d' }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

/* prettier-ignore */
const pathKeywords = [
  { path: '/', label: 'Home', keywords: ['home', 'start', 'main'] },
  { path: '/login', label: 'Login', keywords: ['login', 'signin'] },
  { path: '/logout', label: 'Logout', keywords: ['logout', 'signout', 'quit', 'exit'] },
  { path: '/dashboard', label: 'Dashboard', keywords: ['dashboard', 'overview', 'summary'] },
  { path: '/payroll/history', label: 'Payroll', keywords: ['payroll', 'payment', 'salary'] },
  { path: '/payroll/direct-deposit', label: 'Direct Deposit', keywords: ['direct deposit', 'bank transfer', 'payment method'] },
  { path: '/payroll/tax-information', label: 'Tax Information', keywords: ['tax information', 'tax details', 'IRS', 'taxes', 'w4'] },
  { path: '/benefits', label: 'Benefits', keywords: ['benefits', 'perks', 'advantages'] },
  { path: '/profile', label: 'Profile', keywords: ['profile', 'personal data', 'user'] },
  { path: '/profile/update', label: 'Update Profile', keywords: ['update profile', 'edit details', 'change information'] },
  { path: '/time-off', label: 'Time Off', keywords: ['time off', 'leave', 'holiday', 'vacation', 'pto'] },
  { path: '/time-off/request', label: 'Request Time Off', keywords: ['request time off', 'apply for leave', 'leave request'] },
  { path: '/company/org-chart', label: 'Organization Chart', keywords: ['organization chart', 'company structure', 'hierarchy'] },
  { path: '/company/directory', label: 'Company Directory', keywords: ['directory', 'contacts', 'company contacts'] },
  { path: '/company/calendar', label: 'Company Calendar', keywords: ['calendar', 'schedule', 'events', 'company events'] },
  { path: '/support', label: 'Support', keywords: ['contact us', 'support', 'help', 'assistance', 'customer service'] },
  { path: '/prism/redirect', label: 'Back office portal', keywords: ['back', 'office', 'back office', 'portal', 'back office portal'] },
];

export const createProviders = (
  api: AxiosInstance,
  navigate: NavigateFunction
) => {
  const dictionaryProvider = {
    name: 'dictionary',
    fetch: async (searchTerm: string) => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const matchedPaths = pathKeywords.filter((pathInfo) =>
        pathInfo.keywords.some((keyword: string) =>
          keyword.toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
      return matchedPaths.map((pathInfo) => ({
        keywords: pathInfo.keywords,
        url: pathInfo.path,
        label: pathInfo.label,
        provider: 'dictionary',
      }));
    },
    getOptionLabel: (result: any) => `${result.keyword}: ${result.label}`,
    render: (result: any, searchTerm: string, handleClose: any) => (
      <ListItemButton
        key={result.url}
        onClick={() => {
          navigate(result.url);
          handleClose();
        }}
        sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <ListItemAvatar>
          <Avatar>
            <LinkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={highlightText(result.label, searchTerm)} />
        <ListItemSecondaryAction>
          <IconButton edge="end">
            <ChevronRight />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>
    ),
  };

  const employeeProvider = {
    name: 'employee',
    fetch: async (searchTerm: string) => {
      const { data } = await api.get('/company/employees');

      const options = {
        includeScore: true,
        keys: [
          'first_name',
          'nickname',
          'last_name',
          'position.employee_title',
          'position.department',
        ],
        useExtendedSearch: true,
        threshold: 0.2,
        minMatchCharLength: 3,
        tokenize: true,
      };

      const fuse = new Fuse(data.results, options);
      const searchResults = fuse.search(searchTerm);

      return searchResults.map(({ item }: any) => ({
        ...item,
        provider: 'employee',
      }));
    },
    getOptionLabel: (result: any) => `${result.name} (${result.role})`,
    render: (result: any, searchTerm: string) => (
      <ListItemButton
        key={getDisplayName(result)}
        sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}
        onClick={(e) => {
          e.preventDefault();
          navigate(`/profile/${result.id}`);
        }}
        href={`/profile/${result.id}`}
      >
        <ListItemAvatar>
          <ArmhrAvatar name={getDisplayName(result)} />
        </ListItemAvatar>
        <ListItemText
          primary={highlightText(getDisplayName(result), searchTerm)}
          secondary={highlightText(result.position.employee_title, searchTerm)}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end">
            <ChevronRight />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItemButton>
    ),
  };

  const providers = [dictionaryProvider, employeeProvider];

  return providers;
};
