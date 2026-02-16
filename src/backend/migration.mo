import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    userProfiles : Map.Map<Principal, {
      name : Text;
      email : ?Text;
    }>;
    userSettings : Map.Map<Principal, {
      petType : {
        #dog;
        #cat;
        #fox;
        #penguin;
        #default;
        #custom : Text;
      };
      focusDuration : Nat;
      breakDuration : Nat;
      wastedPlatforms : [Text];
      darkMode : Bool;
    }>;
    userSessions : Map.Map<Principal, List.List<{
      timestamp : Int;
      duration : Nat;
      petType : {
        #dog;
        #cat;
        #fox;
        #penguin;
        #default;
        #custom : Text;
      };
      focusType : {
        #default;
        #study;
        #exercise;
        #creative;
        #work;
      };
    }>>;
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
