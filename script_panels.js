
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

        previousButton.style.backgroundColor = "#333333";
        previousButton.style.color = "#333333";
        previousInside.style.backgroundColor = "#00B2FF";
    }

    previousButtonId = id;

    var inside = button.getElementsByClassName("pButtonInside").item(0);
    button.style.backgroundColor = "#EBE6E2";
    button.style.color = "#333333";
    inside.style.backgroundColor = "#EBE6E2";

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
            button.style.color = "#333333";
            button.style.backgroundColor = "#333333"
            button.setAttribute("onclick", " switchPanel('" + buttonid.toString() + "')");
        }
    }

    switchPanel("button_id_0");
}

window.onload = initializeButtons();