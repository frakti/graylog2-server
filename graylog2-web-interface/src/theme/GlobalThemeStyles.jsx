import { createGlobalStyle } from 'styled-components';

import { paginationStyles } from 'components/graylog/Pagination.jsx';
import { progressBarStyles } from 'components/graylog/ProgressBar.jsx';
import formControlValidationStyles from './styles/formControlValidationStyles';

const GlobalThemeStyles = createGlobalStyle`
  ${formControlValidationStyles};
  ${paginationStyles};
  ${progressBarStyles};
`;

export default GlobalThemeStyles;
