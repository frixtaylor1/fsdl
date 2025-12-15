import { button, div, p, style} from "../../lib/dom";
import { navigate } from "../router/router";

export default function landing(): HTMLElement {
    const pStyle: HTMLStyleElement = style({}, `
        p {
            font-size: 20px;
            color: #333;
        }

        p:hover {
            color: #FF33333;
        }
    `);
    return div({ style: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } },
        p({}, pStyle, "Hello, World from landing!"),
        button({ onclick: () => navigate("/login") }, "Click Me")
    );
}