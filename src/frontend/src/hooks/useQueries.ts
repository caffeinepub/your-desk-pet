import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile, UserSettings, Session, PetType, Variant_creative_work_exercise_study_default } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserSettings() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<UserSettings | null>({
    queryKey: ['userSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const principal = identity?.getPrincipal();
      if (!principal) throw new Error('No principal available');
      return actor.getUserSettings(principal);
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}

export function useSaveUserSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveUserSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  });
}

export function useGetSessions() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const principal = identity?.getPrincipal();
      if (!principal) throw new Error('No principal available');
      return actor.getSessions(principal);
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });
}

export function useAddSession() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { 
      petType: PetType; 
      duration: bigint; 
      focusType: Variant_creative_work_exercise_study_default;
      wasSuccessful: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Must be logged in to save sessions');
      return actor.addSession(params.petType, params.duration, params.focusType, params.wasSuccessful);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
