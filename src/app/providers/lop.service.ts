import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, database } from 'firebase';
import { Router } from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';

import { UserLop } from '../interfaces/userLop';
import { ListLop } from '../interfaces/listLop';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LopService {
  private listsCollection: AngularFirestoreCollection<ListLop>;
  
  user: UserLop;
  lists: ListLop[] = [];
  
  constructor( public afAuth: AngularFireAuth,
               private router: Router,
               private afs: AngularFirestore
    ) {
    
    this.user = this.getUser();         

    this.afAuth.authState.subscribe( user => {
      if ( !user ) {
        this.removeUser();
      } else {
        this.setUser( user );
      }     
    });   
  }

  public async login() {
    await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then( ( userCredential: auth.UserCredential ) => {
      this.setUser ( userCredential.user )
      this.router.navigate(['lists']);
    });
  }

  public logout() {
    this.afAuth.auth.signOut().then( () => {
      this.removeUser();
      this.router.navigate(['home']);
    });
  }

  private getUser (): UserLop {
    return JSON.parse( localStorage.getItem('uLop') );   
  }

  private setUser ( user: firebase.User ) {
    this.user = {
      name: user.displayName,
      uid: user.uid,
      urlPhoto: user.photoURL,
      lastDateSelected: 0,
      selection: { selectionDay: 0, uidUserSelected: '' }
    }

    localStorage.setItem('uLop', JSON.stringify(this.user));
  }

  private removeUser () {
    localStorage.removeItem('uLop');
  }

  isAutenticated () {
    let user: UserLop = this.getUser(); 

    if (user && user.uid) return true;

    return false;
  }
  

  getLists() {
    this.listsCollection = this.afs.collection<ListLop>('lists');

    
    return this.listsCollection.valueChanges().pipe(
      map( (listas: ListLop[]) => {
        this.lists = listas;
        return listas;
      }));
  }


  getList( uid: string ) {
    this.listsCollection = this.afs.collection<ListLop>('lists');

    return this.listsCollection.doc( uid ).valueChanges().pipe( 
      map( (lista: ListLop) => {
        return lista;
      })
    );

  }

  newList ( name: string ) {
    let members: UserLop[] = [];

    members.push ( this.user );

    const id = this.afs.createId();

    let list = {
      name: name,
      uid: id, 
      members: members
    };

    return this.listsCollection.doc( id ).set( list );
  }

  addMember ( list: ListLop ) {

    list.members.forEach ( member => {
      if (member.uid === this.user.uid) return;
    } )

    list.members.push( this.user );

    return this.listsCollection.doc( list.uid ).set( list );
  } 

  updateList ( list: ListLop ) {
    return this.listsCollection.doc( list.uid ).set( list );
  } 
}
