"use strict";

import XButton from "./src/component/button";
import XFetch from "./src/component/fetch";
import XRepeat from "./src/component/repeat";
import XRoute from "./src/component/route";
import XRow from "./src/component/row";
import XSave from "./src/component/save";
import XStringView from "./src/component/stringview";
import XWindow from "./src/component/window";

customElements.define('x-button', XButton);
customElements.define('x-fetch', XFetch);
customElements.define('x-repeat', XRepeat);
customElements.define('x-route', XRoute);
customElements.define('x-row', XRow);
customElements.define('x-save', XSave);
customElements.define('x-string-view', XStringView);
customElements.define('x-window', XWindow);