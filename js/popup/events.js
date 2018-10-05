let metadata = {};

const inputChanged = (ev) => {
    let settings = JSON.parse(formToJson());
    
    chrome.storage.sync.set({ settings });

    const form = closestElement(ev.target, 'form');

    chrome.tabs.query({url: '*://*.blip.ai/*'}, (tabs) => {
        if (tabs.length < 1)
            return;

        for (let tab of tabs){
            chrome.tabs.sendMessage(tab.id, {type: "form-change", form: form.id, input: ev.target.name, settings});
        }
    });
}

document.body.onload = () => {
    let eventHandlerNodes = document.getElementsByClassName('event-handler');
    const attributeKey = 'event-';

    for (let node of eventHandlerNodes) {
        let attributes = node.attributes;

        for (let attribute of attributes) {
            if (attribute.name.indexOf(attributeKey) === 0){
                let event = attribute.name.replace(attributeKey, '');
                node[event] = window[attribute.value];
            }
        }
    }

    let formInputs = document.querySelectorAll('input, select, textarea');

    for (let input of formInputs) {
        input.onclick = inputChanged;
    }

    loadData();
};