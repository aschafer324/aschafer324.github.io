var newDraftOrder = [
    {
        id: 20040726, name: "Magnus", order: 7, timeleft: 900, color: "#2196F3"
    },
    {
        id: 19820803, name: "Brenda", order: 11, timeleft: 900, color: "#FFEB3B"
    },
    {
        id: 19800324, name: "Aaron", order: 10, timeleft: 900, color: "#008361"
    },
    {
        id: 20020416, name: "Kaya", order: 5, timeleft: 900, color: "#76FF03"
    },
    {
        id: 19740125, name: "Michelle", order: 2, timeleft: 900, color: "#E91E63"
    },
    {
        id: 19481126, name: "Grammy", order: 6, timeleft: 900, color: "#64FFDA"
    },
    {
        id: 19780111, name: "Erik", order: 3, timeleft: 900, color: "#FF9800"
    },
    {
        id: 19460109, name: "Papa", order: 1, timeleft: 900, color: "#607D8B"
    },
    {
        id: 19780131, name: "Angela", order: 14, timeleft: 900, color: "#FF80AB"
    },
    {
        id: 19760802, name: "Davin", order: 9, timeleft: 900, color: "#1A237E"
    },
    {
        id: 20060317, name: "Odin", order: 4, timeleft: 900, color: "#2196F3"
    },
    {
        id: 20080223, name: "Tyr", order: 8, timeleft: 900, color: "#B71C1C"
    },
    {
        id: 20080520, name: "Torin", order: 12, timeleft: 900, color: "#283593"
    },
    {
        id: 20080520, name: "Xander", order: 13, timeleft: 900, color: "#1B5E20"
    }
];

var fft = {};
fft = {
    runningNow: null,
    secsAllowed: 900,
    data: null,
    buttonTemplate: "<div class=\"player\" style=\"background-color:*|BGCOLOR|*\" id=\"*|ID|*\"><div class=\"name\">*|NAME|*</div><div class=\"order\">*|ORDER|*</div><div class=\"football\"></div><div class=\"time\">*|TIMELEFT|*</div></div>",
    interval: null,
    mnf: new Audio('/content/mnf.mp3'),
    fox: new Audio('/content/fox.mp3'),
    timeStarted: 0,
    
    init: function () {
        var img = new Image();
        img.src = '/images/football-animation.gif';
        var draftOrder = localStorage.getItem('draftOrder');
        if (draftOrder) {
            fft.data = JSON.parse(draftOrder);
        } else {
            fft.data = _.sortBy(newDraftOrder, function(x) { return x.order; });
        }
        fft.drawButtons();

        $(".player").click(function() {
            fft.tapped($(this).attr("id"));
            
        });
        $(".pause").click(function () {
            clearInterval(fft.interval);
            $('.headline').text('The draft is paused...');
        });
        $(".reset").click(function () {
            if (confirm("Are you sure you want to reset the draft?")) {
                localStorage.setItem('draftOrder', "");
                window.location.reload();
                fft.mnf.play();
                fft.timeStarted = new Date();
            }
            $('.headline').text('Waiting to draft...');
        });


        fft.mnf.play();
    },
    
    tapped: function (id) {
        if (fft.timeStarted == 0) {
            fft.timeStarted = new Date();
        }
        if (fft.interval) {
            clearInterval(fft.interval);
        }
        var q = $.Enumerable.From(fft.data)
            .Where(function (x) { return x.id == id; })
            .ToArray();
        if (q) {
            fft.runningNow = q[0];
            fft.startInterval();
            $('.headline').text(fft.runningNow.name + ' is on the clock!');
            $('.football').hide();
            $('#' + fft.runningNow.id + ' .football').show();
            fft.fox.play();
            
        }
        localStorage.setItem('draftOrder', JSON.stringify(fft.data));
    },
    
    formatTime: function(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        if (mins < 10) {
            mins = "0" + mins;
        }
        if (secs < 10) {
            secs = "0" + secs;
        }
        return mins + ":" + secs;
    },

    startInterval: function() {
        fft.interval = setInterval(function() {
            fft.runningNow.timeleft--;
            $("#" + fft.runningNow.id).find(".time").html(fft.formatTime(fft.runningNow.timeleft));
            console.log(fft.runningNow);
        }, 1000);
    },

    drawButtons: function() {
        fft.data.forEach(function(el, ix, ar) {
            $("#container").append(fft.dataBind(el));
        });

        var marginSize = 5;
        var numRows = 2;
        var buttonWidth = (document.documentElement.clientWidth / Math.round(fft.data.length / numRows)) - 3;
        var buttonHeight = (document.documentElement.clientHeight - $('.menu').height() - 0) / numRows;
        $('.player').css('height', buttonHeight - (marginSize * 2));
        $('.player').css('width', buttonWidth - (marginSize * 2));
        $('.player').css('margin', marginSize);
    },
    
    dataBind: function (player) {
        return fft.buttonTemplate
                .replace("*|ID|*", player.id)
                .replace("*|NAME|*", player.name)
                .replace("*|ORDER|*", "#" + player.order)
                .replace("*|TIMELEFT|*", fft.formatTime(player.timeleft))
                .replace("*|BGCOLOR|*", player.color);
    }
}