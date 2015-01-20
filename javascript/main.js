
function toggleInfo(){
    $("#info-overlay").toggleClass("show");
    $("#info-btn").toggleClass("show");
}

function drawChannelButtons() {
    // Add the all button
    $("#channel-buttons ul").append(channelButtonHTML(-1, "RANDOM", true));
    for(var index = 0; index < Config.channels.length; index++) {
        $("#channel-buttons ul").append(channelButtonHTML(index, Config.channels[index].title));
    }
}

function channelButtonHTML(channel, name, selected) {
    var element_class = selected ? "selected" : "";
    return "<li class='" + element_class + "'><a href='#' onclick='selectChannel(this, " + channel + "); return false;'>" + name + "</a></li>"
}

function selectChannel(button, channel) {
    $("#channel-buttons .selected").removeClass("selected");
    Player.change_channel(channel);
    $(button).parent("li").addClass("selected");
}

function enterSite(self) {
    drawChannelButtons();
    $(self).parent().fadeOut(5000);
    Player.change_channel(-1);
}

$(document).ready(function() {
    $('#JoinButton').click(function() {
        enterSite(this);
    });

    $("#info-btn").click(toggleInfo);

    $("video#bgvideo").on("ended", function () {
        Player.switch_media();
    });

    $(this).keydown(function(e) {
        Player.switch_media();
    });

});