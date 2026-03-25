import Map "mo:core/Map";
import Time "mo:core/Time";
import BaseText "mo:base/Text";

persistent actor {

  type User = {
    userId : Text;
    passwordHash : Text;
    createdAt : Int;
  };

  type Session = {
    userId : Text;
    createdAt : Int;
  };

  type MappingRow = {
    user_story : Text;
    regulatory_clause : Text;
    requirement_id : Text;
    compliance_status : Text;
    notes : Text;
  };

  type MappingResult = {
    status : Text;
    data : [MappingRow];
  };

  type AuthResult = {
    success : Bool;
    message : Text;
    token : ?Text;
  };

  transient var users : Map.Map<Text, User> = Map.empty<Text, User>();
  transient var sessions : Map.Map<Text, Session> = Map.empty<Text, Session>();

  func hashPassword(password : Text) : Text {
    let h = BaseText.hash(password);
    debug_show(h);
  };

  func generateToken(userId : Text, timestamp : Int) : Text {
    let raw = userId # "_" # debug_show(timestamp);
    let h = BaseText.hash(raw);
    userId # "_" # debug_show(h);
  };

  // No-op stub required by the platform's useActor hook
  public shared func _initializeAccessControlWithSecret(_secret : Text) : async () {};

  public func signup(userId : Text, password : Text) : async AuthResult {
    if (userId.size() == 0 or password.size() == 0) {
      return { success = false; message = "User ID and password are required"; token = null };
    };
    switch (users.get(userId)) {
      case (?_) {
        return { success = false; message = "User ID already exists"; token = null };
      };
      case (null) {
        let hash = hashPassword(password);
        let user : User = { userId = userId; passwordHash = hash; createdAt = Time.now() };
        users.add(userId, user);
        return { success = true; message = "Account created successfully"; token = null };
      };
    };
  };

  public func login(userId : Text, password : Text) : async AuthResult {
    switch (users.get(userId)) {
      case (null) {
        return { success = false; message = "Invalid credentials"; token = null };
      };
      case (?user) {
        let hash = hashPassword(password);
        if (hash != user.passwordHash) {
          return { success = false; message = "Invalid credentials"; token = null };
        };
        let now = Time.now();
        let token = generateToken(userId, now);
        let session : Session = { userId = userId; createdAt = now };
        sessions.add(token, session);
        return { success = true; message = "Login successful"; token = ?token };
      };
    };
  };

  public func logout(token : Text) : async Bool {
    switch (sessions.get(token)) {
      case (null) { false };
      case (?_) {
        sessions.remove(token);
        true;
      };
    };
  };

  public query func validateSession(token : Text) : async ?Text {
    switch (sessions.get(token)) {
      case (null) { null };
      case (?session) { ?session.userId };
    };
  };

  public func runMapping(token : Text, regulatoryRequirement : Text, _textInput : Text, _fileData : Text) : async MappingResult {
    switch (sessions.get(token)) {
      case (null) { return { status = "error"; data = [] } };
      case (?_) {};
    };

    let rows : [MappingRow] = if (regulatoryRequirement == "CFR PART 11") {
      [
        { user_story = "User shall authenticate with unique credentials"; regulatory_clause = "21 CFR Part 11.10(d)"; requirement_id = "AU-001"; compliance_status = "Mapped"; notes = "Electronic signature requirement" },
        { user_story = "System shall maintain audit trails for all actions"; regulatory_clause = "21 CFR Part 11.10(e)"; requirement_id = "AT-001"; compliance_status = "Mapped"; notes = "Audit trail must be computer generated" },
        { user_story = "Records shall be protected from unauthorized access"; regulatory_clause = "21 CFR Part 11.10(c)"; requirement_id = "SEC-001"; compliance_status = "Mapped"; notes = "Protection and retrieval of records" },
        { user_story = "System shall validate accuracy of records"; regulatory_clause = "21 CFR Part 11.10(a)"; requirement_id = "VAL-001"; compliance_status = "Partial"; notes = "Validation of systems" },
        { user_story = "Operational system checks shall be enforced"; regulatory_clause = "21 CFR Part 11.10(f)"; requirement_id = "OPS-001"; compliance_status = "Mapped"; notes = "Operational checks for sequencing" },
        { user_story = "Access controls shall limit system users"; regulatory_clause = "21 CFR Part 11.10(g)"; requirement_id = "AC-001"; compliance_status = "Mapped"; notes = "Authority checks" },
        { user_story = "Device checks shall ensure valid data input"; regulatory_clause = "21 CFR Part 11.10(h)"; requirement_id = "DEV-001"; compliance_status = "Partial"; notes = "Device checks for data entry" },
        { user_story = "Personnel shall be qualified for system use"; regulatory_clause = "21 CFR Part 11.10(i)"; requirement_id = "TRN-001"; compliance_status = "Not Mapped"; notes = "Training requirement" },
        { user_story = "System documentation shall be maintained"; regulatory_clause = "21 CFR Part 11.10(k)"; requirement_id = "DOC-001"; compliance_status = "Mapped"; notes = "Documentation and change control" },
        { user_story = "Electronic signatures shall be unique to each user"; regulatory_clause = "21 CFR Part 11.100(a)"; requirement_id = "ES-001"; compliance_status = "Mapped"; notes = "Uniqueness of electronic signatures" }
      ]
    } else {
      [
        { user_story = "Data integrity shall be maintained"; regulatory_clause = "Data Governance Policy"; requirement_id = "DG-001"; compliance_status = "Mapped"; notes = "Data integrity controls" },
        { user_story = "User access shall be managed"; regulatory_clause = "Access Management Policy"; requirement_id = "AM-001"; compliance_status = "Mapped"; notes = "Role-based access control" },
        { user_story = "System changes shall be controlled"; regulatory_clause = "Change Management Policy"; requirement_id = "CM-001"; compliance_status = "Partial"; notes = "Change management process" },
        { user_story = "Incidents shall be logged and tracked"; regulatory_clause = "Incident Management Policy"; requirement_id = "IM-001"; compliance_status = "Not Mapped"; notes = "Incident response procedures" },
        { user_story = "Data retention policy shall be enforced"; regulatory_clause = "Data Retention Policy"; requirement_id = "DR-001"; compliance_status = "Mapped"; notes = "Retention schedule" }
      ]
    };

    { status = "success"; data = rows };
  };

};
