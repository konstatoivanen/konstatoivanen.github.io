var previousButtonId = "";
var currentScale = 0;
var audioClips = null;
var playAudio = false;

function updateScaling()
{
    var vw = window.innerWidth / 100;
    var vh = window.innerHeight / 100;

    var maxAspect = 16.0 / 9.0;
    vw = Math.min(vw, vh * Math.min(vw / vh, maxAspect));

    var length = Math.sqrt(vw * vw + vh * vh);

    currentScale = Math.max(8, length);
    document.documentElement.style.setProperty('--cscale', currentScale + "px");

    var panel = document.getElementById('panelFrame');

    if (panel != null && panel.contentWindow != null)
    {
        panel.contentWindow.document.documentElement.style.setProperty('--cscale', currentScale + "px");
    }
}

function playSound(index, vol)
{
    if (!playAudio)
    {
        return;
    }

    if (audioClips === null)
    {
        audioClips = [];
        audioClips[0] = new Audio('S_Select.wav');
        audioClips[1] = new Audio('S_Enter.wav');
        audioClips[2] = new Audio('S_Shift.wav');
    }

    audioClips[index].volume = vol;
    audioClips[index].play();
}

function lerpString(content, id)
{
    var length = 0;
    var target = document.getElementById(id);
    var interval = 200 / content.length;

    if (target.dataset.tweenHandle != null)
    {
        clearInterval(target.dataset.tweenHandle);
    }

    if (target.dataset.tweenTimeoutHandle != null)
    {
        clearTimeout(target.dataset.tweenTimeoutHandle);
    }

    target.dataset.tweenHandle = window.setInterval(function ()
    {
        if (length <= content.length)
        {
            target.innerHTML = content.substring(0, length)
            ++length;
        }

    }, interval);

    target.dataset.tweenTimeoutHandle = setTimeout(function ()
    {
        clearInterval(target.dataset.tweenHandle);
        target.dataset.tweenHandle = null;
        target.dataset.tweenTimeoutHandle = null;
        target.innerHTML = content;
    },
    interval * content.length + 60);
}

function bindButtonHover(button, contentTag, i)
{
    var buttonContent = button.getElementsByTagName(contentTag).item(0);
    buttonContent.id = "button_content_" + i.toString();

    const c = buttonContent.innerHTML.toString();
    const id = buttonContent.id.toString();

    button.addEventListener('mouseenter', e => { lerpString(c, id); });
}

function switchPanel(id)
{
    if (id == previousButtonId)
    {
        return;
    }

    playSound(1, 0.15);

    var button = document.getElementById(id);
    var previousButton = document.getElementById(previousButtonId);

    if (previousButton !== null)
    {
        var previousInside = previousButton.getElementsByClassName("pButtonInside").item(0);

        previousButton.style.backgroundColor = "var(--color-button-hollow-default)";
        previousButton.style.color = "var(--color-button-hollow-default)";
        previousInside.style.backgroundColor = "var(--color-background)";
    }

    previousButtonId = id;

    var inside = button.getElementsByClassName("pButtonInside").item(0);
    button.style.backgroundColor = "var(--color-button-hollow-selected-bg)";
    button.style.color = "var(--color-button-hollow-selected-fg)";
    inside.style.backgroundColor = "var(--color-button-hollow-selected-bg)";
    document.getElementById('panelFrame').src = button.dataset.content;

    updateScaling();
}

function initialize()
{
    updateScaling();

    window.addEventListener('resize', function () { updateScaling(); });

    document.getElementById('panelFrame').addEventListener("load", function ()
    {
        this.contentWindow.document.documentElement.style.setProperty('--cscale', currentScale + "px");
    });

    var buttons = document.getElementsByClassName("pButton");

    for (var i = 0; i < buttons .length; i++)
    {
        var button = buttons.item(i);

        if (button.dataset.content != null)
        {
            const buttonid = "button_id_" + i.toString();
            button.id = buttonid;
            button.style.color = "var(--color-button-hollow-default)";
            button.style.backgroundColor = "var(--color-button-hollow-default)";

            button.addEventListener('click', e => { switchPanel(buttonid.toString()); });
            button.addEventListener('mouseenter', e => { playSound(0, 0.15); });
            bindButtonHover(button, "h5", i);
        }
    }

    switchPanel("button_id_0");
}

window.onload = initialize();