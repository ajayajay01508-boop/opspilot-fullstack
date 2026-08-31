<?php
namespace OpsPilot;
use MongoDB\Client;
use Firebase\JWT\JWT;
final class App {
 private $db;
 public function __construct() {
  $client=new Client(getenv('MONGODB_URI') ?: 'mongodb://mongo:27017');
  $this->db=$client->selectDatabase('opspilot');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Origin: *');
 }
 private function body(): array { return json_decode(file_get_contents('php://input'),true) ?? []; }
 private function out($data,int $status=200): void { http_response_code($status); echo json_encode($data); }
 public function handle(string $method,string $path): void {
  if($method==='OPTIONS'){http_response_code(204);return;}
  if($path==='/health'){ $this->out(['status'=>'ok','service'=>'php-api']); return; }
  if($path==='/api/auth/login' && $method==='POST'){
   $b=$this->body(); if(($b['email']??'')===''||($b['password']??'')===''){ $this->out(['error'=>'credentials required'],422);return;}
   $token=JWT::encode(['sub'=>$b['email'],'role'=>'incident_manager','exp'=>time()+3600],getenv('JWT_SECRET')?:'dev-secret','HS256');
   $this->out(['token'=>$token,'user'=>['email'=>$b['email'],'name'=>'Ajay S']]); return;
  }
  if($path==='/api/incidents' && $method==='GET'){
   $rows=[]; foreach($this->db->incidents->find([],['sort'=>['createdAt'=>-1]]) as $r){$r['_id']=(string)$r['_id'];$rows[]=$r;}
   $this->out(['data'=>$rows,'count'=>count($rows)]); return;
  }
  if($path==='/api/incidents' && $method==='POST'){
   $b=$this->body(); foreach(['title','service','severity'] as $f) if(empty($b[$f])){$this->out(['error'=>"$f is required"],422);return;}
   $doc=$b+['status'=>'Investigating','owner'=>'Unassigned','createdAt'=>new \MongoDB\BSON\UTCDateTime()];
   $id=$this->db->incidents->insertOne($doc)->getInsertedId(); $this->db->audit_events->insertOne(['incidentId'=>(string)$id,'action'=>'created','at'=>new \MongoDB\BSON\UTCDateTime()]);
   $this->out(['id'=>(string)$id,'message'=>'Incident created'],201); return;
  }
  $this->out(['error'=>'route not found'],404);
 }
}
