using System;
using System.Reactive.Linq;
using DotNetify;

namespace UseDotnetify
{
    public class HelloWorldVm : MulticastVM
    {
        public HelloWorldVm()
        {
            var firstName = AddProperty("FirstName", "Hello");
            var lastName = AddProperty("LastName", "World");

            AddProperty<String>("FullName")
                .SubscribeTo(firstName.CombineLatest(lastName, (fn, ln) => $"{fn} {ln}"));
        }
    }
}
