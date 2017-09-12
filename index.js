"use strict";

import XRoot from "./src/component/root";
import XButton from "./src/component/button";
import XWindow from "./src/component/window";
import XRoute from "./src/component/route";
import XFetch from "./src/component/fetch";
import XNavbar from "./src/component/navbar";
import XOverlay from "./src/component/overlay";
import XRepeat from "./src/component/repeat";
import XRow from "./src/component/row";
import XStringView from "./src/component/stringview";

customElements.define('x-root', XRoot);
customElements.define('x-button', XButton);
customElements.define('x-window', XWindow);
customElements.define('x-route', XRoute);
customElements.define('x-fetch', XFetch);
customElements.define('x-navbar', XNavbar);
customElements.define('x-overlay', XOverlay);
customElements.define('x-repeat', XRepeat);
customElements.define('x-row', XRow);
customElements.define('x-string-view', XStringView);

// Enable root element
document.querySelector('x-root').enable();