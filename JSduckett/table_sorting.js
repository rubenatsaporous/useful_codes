(function() {
    var SORT = {
        controls: document.querySelectorAll('th'),
        data: [
            {genre: 'Film', title: 'Animals', duration: '6:40', date: '2005-12-21'},
            {genre: 'Film', title: 'The Deer', duration: '6:24', date: '2014-02-28'},
            {genre: 'Animation', title: 'The Ghost', duration: '11:40', date: '2012-04-10'},
            {genre: 'Animation', title: 'Wagons', duration: '21:40', date: '2007-04-12'},
            {genre: 'Animation', title: 'Wildfood', duration: '3:47', date: '2014-07-16'}
        ],
        sort_order: null,
        table: document.getElementsByTagName('table').item(0),
        tbody: document.getElementsByTagName('tbody').item(0)
    };

    var td_creator = function(input) {
        var td = document.createElement('td');
        td.textContent = input;
        return td;
    };

    var tr_creator = function(input) {
        var tr = document.createElement('tr');
        input.forEach((td) => {
            tr.appendChild(td);
        });
        return tr;
    };

     var compare = {
        name: function(a, b) {
            var title_a = a.data.title.replace(/^the /i, '');
            var title_b = b.data.title.replace(/^the /i, '');

            var value;

            if(title_a > title_b) {
                value = 1
            } else if (title_a == title_b) {
                value = 0
            } else {
                value = -1
            }

            if(SORT.sort_order === 'asc') {
                return value;
            } else {
                return value*(-1);
            }
        },
        duration: function(a, b) {
            var duration_a = a.data.duration.split(':');
            var duration_b = b.data.duration.split(':');

            var time_a = parseInt(duration_a[0])*60 + parseInt(duration_a[1]);
            var time_b = parseInt(duration_b[0])*60 + parseInt(duration_b[1]);

            if(SORT.sort_order === 'asc') {
                return time_a - time_b;
            } else {
                return time_b - time_a;
            }
        },
        date: function(a, b) {
            var date_a = new Date(a.data.date);
            var date_b = new Date(b.data.date);

            if(SORT.sort_order === 'asc') {
                return date_a - date_b;
            } else {
                return date_b - date_a;
            }
        }
    };

    var data_elems = SORT.data.map((data) => {
        var td_array = [
            td_creator(data.genre),
            td_creator(data.title),
            td_creator(data.duration),
            td_creator(data.date)
        ];

        var tr = tr_creator(td_array);

        return { data: data, ele: tr };
    });

    data_elems.forEach((item) => {
        SORT.tbody.appendChild(item.ele);
    });

    SORT.controls.forEach((control) => {
        control.addEventListener('click', function(e) {
            var target = e.target;
            var sort_type = target.dataset.sort;
            if(target.classList.contains('asc') || target.classList.contains('desc')) {
                if(target.classList.contains('asc')) {
                    target.classList.replace('asc', 'desc');
                } else {
                    target.classList.replace('desc', 'asc');
                }
            } else {
                target.classList.add('asc');
            }

            SORT.sort_order = target.className;

            data_elems.sort(compare[sort_type]);

            SORT.tbody.innerHTML = '';

            data_elems.forEach((video) => {
                SORT.tbody.appendChild(video.ele);
            });
        }, false);
    })
    
})();