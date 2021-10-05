
var previousButtonId = "";

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
}

function initializeButtons()
{
    var buttons = document.getElementsByClassName("pButton");

    for (var i = 0; i < buttons .length; i++)
    {
        var button = buttons.item(i);

        if (button.dataset.content != null)
        {
            var buttonid = "button_id_" + i.toString();
            button.id = buttonid;
            button.style.color = "var(--color-button-hollow-default)";
            button.style.backgroundColor = "var(--color-button-hollow-default)";
            button.setAttribute("onclick", " switchPanel('" + buttonid.toString() + "')");
            bindButtonHover(button, "h5", i);
        }
    }

    switchPanel("button_id_0");
}

window.onload = initializeButtons();