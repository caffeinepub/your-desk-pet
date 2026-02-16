import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserSettings {
    wastedPlatforms: Array<string>;
    darkMode: boolean;
    petType: PetType;
    focusDuration: bigint;
    breakDuration: bigint;
}
export interface Session {
    duration: bigint;
    focusType: Variant_creative_work_exercise_study_default;
    petType: PetType;
    timestamp: Time;
}
export type Time = bigint;
export type PetType = {
    __kind__: "cat";
    cat: null;
} | {
    __kind__: "dog";
    dog: null;
} | {
    __kind__: "fox";
    fox: null;
} | {
    __kind__: "penguin";
    penguin: null;
} | {
    __kind__: "custom";
    custom: string;
} | {
    __kind__: "default";
    default: null;
};
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_creative_work_exercise_study_default {
    creative = "creative",
    work = "work",
    exercise = "exercise",
    study = "study",
    default_ = "default"
}
export interface backendInterface {
    addSession(petType: PetType, duration: bigint, focusType: Variant_creative_work_exercise_study_default, wasSuccessful: boolean): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSessions(user: Principal): Promise<Array<Session>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSessionCount(user: Principal): Promise<bigint>;
    getUserSettings(user: Principal): Promise<UserSettings | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveUserSettings(settings: UserSettings): Promise<void>;
}
