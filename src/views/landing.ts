import { button, div, p, style } from "../../lib/dom";
import { navigate } from "../router/router";

export default function landing(): HTMLElement {
    return div({ style: { minHeight: '100vh', display: 'flex', flexDirection: 'column' } },
        p({
            innerText: "Hello, World from landing!", 
            style: { color: 'red', fontSize: '24px' },
            hover: {
                color: 'black',
                backgroundColor: 'red',
            }
        }),
        button({ onclick: () => navigate("/login") }, "Click Me")
    );
}