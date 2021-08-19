import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioListComponent } from './audio-list/audio-list.component';
import { AdminComponent } from './components/admin/admin.component';
import { LandingComponent } from './components/landing/landing.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: LandingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent},
  { path: 'landing', component: LandingComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'playlist', component: PlaylistComponent},
  { path: 'audio', component: AudioListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
