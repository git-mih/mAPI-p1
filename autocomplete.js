const createAutoComplete = ({ 
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData 
}) => {
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input"/>
        <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
        </div>
    `;

    const input = root.querySelector("input");
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = debounce(async function(event) {
        const items = await fetchData(event.target.value);

        if (!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');


        for (let item of items) {
            // add movies into the dropdown menu
            const a = document.createElement('a');
            a.classList.add('dropdown-item');
            a.innerHTML = renderOption(item);
            resultsWrapper.appendChild(a);

            a.addEventListener('click', () => {
                input.value = inputValue(item);
                dropdown.classList.remove('is-active');
                onOptionSelect(item)
            })
        }
    });

    input.addEventListener('input', onInput);

    document.addEventListener('click', event => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        };
    })
};
