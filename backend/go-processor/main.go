package main
import("context";"encoding/json";"log";"net/http";"os";"sync/atomic";"time";"go.mongodb.org/mongo-driver/mongo";"go.mongodb.org/mongo-driver/mongo/options")
type Event struct{Service string `json:"service"`; Latency int `json:"latency_ms"`; Success bool `json:"success"`; At time.Time `json:"at"`}
var processed uint64
func main(){ctx:=context.Background(); uri:=os.Getenv("MONGODB_URI");if uri==""{uri="mongodb://mongo:27017"};client,err:=mongo.Connect(ctx,options.Client().ApplyURI(uri));if err!=nil{log.Fatal(err)};events:=client.Database("opspilot").Collection("service_events")
 http.HandleFunc("/health",func(w http.ResponseWriter,r *http.Request){json.NewEncoder(w).Encode(map[string]any{"status":"ok","processed":atomic.LoadUint64(&processed)})})
 http.HandleFunc("/events",func(w http.ResponseWriter,r *http.Request){if r.Method!="POST"{http.Error(w,"method not allowed",405);return};var e Event;if json.NewDecoder(r.Body).Decode(&e)!=nil||e.Service==""{http.Error(w,"invalid event",422);return};e.At=time.Now().UTC();if _,err:=events.InsertOne(r.Context(),e);err!=nil{http.Error(w,"storage error",500);return};atomic.AddUint64(&processed,1);w.WriteHeader(202);json.NewEncoder(w).Encode(map[string]string{"status":"accepted"})})
 log.Println("Go event processor listening on :8090");log.Fatal(http.ListenAndServe(":8090",nil))}
