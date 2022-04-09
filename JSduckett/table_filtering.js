(function(){
    var people = [
        {
            name: 'Casey',
            rate: 60
        },
        {
            name: 'Camille',
            rate: 80
        },
        {
            name: 'Gordon',
            rate: 75
        },
        {
            name: 'Nigel',
            rate: 120
        }
    ];

    var rows = [];
    var table_content_ele = document.getElementById('table').getElementsByTagName('table').item(0).getElementsByTagName('tbody').item(0);
    var min_value = document.getElementById('min');
    var max_value = document.getElementById('max');

    var slider = document.getElementById('test-slider');

    noUiSlider.create(slider, {
        start: [40,150],
        connect: true,
        step: 1,
        orientation: 'horizontal',
        range: {
            min: 0,
            max: 200
        },
    });

    var makeRows = function() {
        people.forEach((person) => {
            var name_td = document.createElement('td');
            name_td.className = 'center-align';
            var rate_td = document.createElement('td');
            rate_td.className = 'center-align';
            var person_tr = document.createElement('tr');
            name_td.textContent = person.name;
            rate_td.textContent = person.rate;
            person_tr.appendChild(name_td);
            person_tr.appendChild(rate_td);
            rows.push({
                person: person,
                element: person_tr
            });
        });
    };

    var appendRows = function() {
        rows.forEach((row) => {
            table_content_ele.appendChild(row.element);
        });
    };

    makeRows();
    appendRows();

    slider.noUiSlider.on('update', (values) => {
        var min = parseInt(values[0]);
        var max = parseInt(values[1]);
        min_value.value = min;
        max_value.value = max;
        rows.forEach((row) => {
            if(row.person.rate < min || row.person.rate > max) {
                row.element.style.display = 'none';
            } else {
                row.element.style.display = '';
            }
        });
        
        min_value.max = parseInt(max_value.value) - 1;
        max_value.min = parseInt(min_value.value) + 1;
    });

    min_value.addEventListener('change', function(e) {
        var target = e.target;
        max_value.min = parseInt(target.value) + 1;
        slider.noUiSlider.set([target.value, max_value.value]);
    }, false);

    max_value.addEventListener('change', function(e) {
        var target = e.target;
        min_value.max = parseInt(target.value) - 1;
        slider.noUiSlider.set([min_value.value, target.value]);
    }, false);
})()