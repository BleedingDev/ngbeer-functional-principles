this.route.queryParams
  .pipe(
    takeUntil(this.unsubscribe$),
    switchMap((currentRoute: { playlistId: string; clipId: string }) => {
      this.playlist$ = this.store.pipe(select($playlist(currentRoute.playlistId)));
      this.clips$ = this.store.pipe(select($playlistClips(currentRoute.playlistId)));
      this.clip$ = this.store.pipe(
        select($playlistsClip(currentRoute.playlistId, currentRoute.clipId))
      );
      return this.clip$;
    }),
    filter((clip): clip is Clip => clip !== null),
    withLatestFrom(this.store.pipe(select($currentVideo))),
    switchMap(([clip, video]) => {
      this.currentClip = clip;
      this.currentVideo = video;
      return this.store.pipe(select($recordingEntity(this.currentClip.recordingId)));
    }),
    filter(recording => recording !== null),
    tap(recording => {
      this.currentRecording = recording;
      this.recordingVideos$ = this.store.pipe(select($recordingVideos(recording.id)));
      this.store.dispatch(new SetCurrentVideo(recording.videos));
    }),
    filter(recording => recording.videos.length > 0),
    switchMap(() => this.store.pipe(select($currentVideo)))
  )
  .subscribe();
