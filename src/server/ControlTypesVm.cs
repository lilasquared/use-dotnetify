using System;
using System.Collections.Generic;
using System.Linq;
using DotNetify;

namespace UseDotnetify
{
    public class ControlTypesVm : BaseVM
    {
        // Text Box

        public String TextBoxValue
        {
            get => Get<String>() ?? "";
            set
            {
                Set(value);
                Changed(() => TextBoxResult);
            }
        }

        public String TextBoxPlaceHolder => "Type something here";
        public String TextBoxResult => !String.IsNullOrEmpty(TextBoxValue) ? $"You typed: {TextBoxValue}" : null;

        // Search Box

        private readonly List<String> _planets = new List<String>
            {"Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Neptune", "Uranus"};

        public String SearchBox
        {
            get => Get<String>() ?? "";
            set
            {
                Set(value);
                Changed(() => SearchResults);
            }
        }

        public String SearchBoxPlaceHolder => "Type a planet";

        public IEnumerable<String> SearchResults => _planets.Where(i => !String.IsNullOrEmpty(SearchBox)
                                                                        && i.ToLower().StartsWith(SearchBox.ToLower())
                                                                        && !String.Equals(i, SearchBox,
                                                                            StringComparison.CurrentCultureIgnoreCase));

        // Check Box

        public Boolean ShowMeCheckBox
        {
            get => Get<Boolean?>() ?? true;
            set
            {
                Set(value);
                Changed(() => CheckBoxResult);
            }
        }

        public Boolean EnableMeCheckBox
        {
            get => Get<Boolean?>() ?? true;
            set
            {
                Set(value);
                Changed(() => CheckBoxResult);
            }
        }

        public String CheckBoxResult => EnableMeCheckBox ? "Enabled" : "Disabled";

        // Simple Drop-down

        public List<String> SimpleDropDownOptions => new List<String> { "One", "Two", "Three", "Four" };

        public String SimpleDropDownValue
        {
            get => Get<String>() ?? "";
            set
            {
                Set(value);
                Changed(() => SimpleDropDownResult);
            }
        }

        public String SimpleDropDownResult =>
            !String.IsNullOrEmpty(SimpleDropDownValue) ? $"You selected: {SimpleDropDownValue}" : null;

        // Drop Down Objects

        public class DropDownItem
        {
            public Int32 Id { get; set; }
            public String Text { get; set; }
        }

        public String DropDownCaption => "Select an item ...";

        public List<DropDownItem> DropDownOptions =>
            new List<DropDownItem>
            {
                new DropDownItem {Id = 1, Text = "Object One"},
                new DropDownItem {Id = 2, Text = "Object Two"},
                new DropDownItem {Id = 3, Text = "Object Three"},
                new DropDownItem {Id = 4, Text = "Object Four"}
            };

        public Int32 DropDownValue
        {
            get => Get<Int32>();
            set
            {
                Set(value);
                Changed(() => DropDownResult);
            }
        }

        public String DropDownResult => DropDownValue > 0
            ? $"You selected: {DropDownOptions.First(i => i.Id == DropDownValue).Text}"
            : null;

        // Radio Buttons

        public String RadioButtonValue
        {
            get => Get<String>() ?? "green";
            set
            {
                Set(value);
                Changed(() => RadioButtonStyle);
            }
        }

        public String RadioButtonStyle => RadioButtonValue == "green" ? "label-success" : "label-warning";

        // Button

        public Action<Boolean> ButtonClicked => _ => ClickCount++;

        public Int32 ClickCount
        {
            get => Get<Int32>();
            set => Set(value);
        }
    }
}
