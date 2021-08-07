
var previousButtonId = "";

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
        }
    }

    switchPanel("button_id_0");
}

window.onload = initializeButtons();