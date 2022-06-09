export class ProfileDto {
  "service-id" : string;
  "name" : string;
  "description"? : string;
  "version" : string;
  "function"? : {
    "description"? : string;
    "real-world-effect"? : string;    
  }[]; 
  "provider" :  {
    "name" : string;
    "description" : string;
    "web-page"? : string;
    "point-of-contact" : {
      "name" : string;
      "function" : string;
      "phone-number"? : string;       
      "email" : string;
    }[]
  };
}
