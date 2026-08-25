import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_database/firebase_database.dart';

class FirebaseService {

  static final database = FirebaseDatabase.instance.ref();

}