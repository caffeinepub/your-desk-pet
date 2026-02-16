import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import List "mo:core/List";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Int "mo:core/Int";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type PetType = {
    #dog;
    #cat;
    #fox;
    #penguin;
    #default;
    #custom : Text;
  };

  module PetType {
    public func compare(pet1 : PetType, pet2 : PetType) : Order.Order {
      func toNat(pet : PetType) : Nat {
        switch (pet) {
          case (#dog) { 0 };
          case (#cat) { 1 };
          case (#fox) { 2 };
          case (#penguin) { 3 };
          case (#default) { 4 };
          case (#custom(_)) { 5 };
        };
      };

      switch (Nat.compare(toNat(pet1), toNat(pet2))) {
        case (#equal) {
          switch (pet1, pet2) {
            case (#custom(text1), #custom(text2)) { Text.compare(text1, text2) };
            case (_) { #equal };
          };
        };
        case (other) { other };
      };
    };
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  public type UserSettings = {
    petType : PetType;
    focusDuration : Nat;
    breakDuration : Nat;
    wastedPlatforms : [Text];
    darkMode : Bool;
  };

  public type Session = {
    timestamp : Time.Time;
    duration : Nat;
    petType : PetType;
    focusType : {
      #default;
      #study;
      #exercise;
      #creative;
      #work;
    };
  };

  module Session {
    public func compare(session1 : Session, session2 : Session) : Order.Order {
      Int.compare(session2.timestamp, session1.timestamp);
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userSettings = Map.empty<Principal, UserSettings>();
  let userSessions = Map.empty<Principal, List.List<Session>>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func saveUserSettings(settings : UserSettings) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save settings");
    };
    userSettings.add(caller, settings);
  };

  public query ({ caller }) func getUserSettings(user : Principal) : async ?UserSettings {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own settings");
    };

    let settings = userSettings.get(user);
    switch (settings) {
      case (?settings) { ?settings };
      case (null) {
        ?{
          petType = #default;
          focusDuration = 25;
          breakDuration = 5;
          wastedPlatforms = [];
          darkMode = false;
        };
      };
    };
  };

  public shared ({ caller }) func addSession(
    petType : PetType,
    duration : Nat,
    focusType : { #default; #study; #exercise; #creative; #work },
    wasSuccessful : Bool,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only logged-in users can add sessions");
    };

    if (not wasSuccessful) { return () };

    let session : Session = {
      timestamp = Time.now();
      duration;
      petType;
      focusType;
    };

    let sessions = switch (userSessions.get(caller)) {
      case (?existingSessions) { existingSessions };
      case (null) { List.empty<Session>() };
    };
    sessions.add(session);

    userSessions.add(caller, sessions);
  };

  public query ({ caller }) func getSessions(user : Principal) : async [Session] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only logged-in users can view sessions");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own sessions");
    };

    switch (userSessions.get(user)) {
      case (?sessions) {
        sessions.toArray().sort();
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getUserSessionCount(user : Principal) : async Nat {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own session count");
    };

    let sessions = switch (userSessions.get(user)) {
      case (?existingSessions) { existingSessions };
      case (null) { List.empty<Session>() };
    };
    sessions.size();
  };
};
