this.route.queryParams
  .pipe(
    switchMap(
      (route: { playlistId: string; clipId: string }) =>
        this.store.pipe(select($playlistsClip(route.playlistId, route.clipId)))
    ),
    filter((clip): clip is Clip => clip !== null),
    switchMap(clip => this.store.pipe(select($recording(clip.recordingId)))),
    filter(recording => recording !== null),
    tap(recording => {
      this.store.dispatch(new SetCurrentVideo(recording.videos));
    }),
    filter(recording => recording.videos.length > 0),
    switchMapTo(this.store.pipe(select($currentVideo)))
  )
  .subscribe((currentVideo: Video) => {
    // Some work with current video
  });
