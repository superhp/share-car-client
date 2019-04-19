// @flow

type User = {
  firstName: string,
  lastName: string,
  pictureUrl: string
};

type UserProfileData = 
 {
  firstName: string,
  lastName: string,
  profilePicture: string,
  email: string,
  licensePlate: string,
  phone: string
};
pointCount: number;

type MyProfileState = {
  loading: boolean,
  user: UserProfileData | null,
  isDriver: ?boolean  
};
type RideData = {
  rideId: number,
  driverEmail: string
};
type Address = {
  country: string,
  city: string,
  street: string,
  number: string
};
