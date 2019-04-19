import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";

import DriverMap from "../components/Driver/DriverMap";

const address = {
    number: "59",
    street: "Didlaukio g.",
    city: "Vilnius",
    country: "Lithuania",
    latitude: 54.7275,
    longitude: 25.2802
}

const mapClickAddress = {
    number: "10",
    street: "J. Kubiliaus g.",
    city: "Vilnius",
    country: "Lithuania",
    latitude: 54.709528,
    longitude: 25.29783
}

const officeAddress = {
    number: "28",
    street: "Savanorių pr.",
    city: "Vilnius",
    country: "Lietuva",
    latitude:54.67574723192748,
    longitude:25.252798705321993
}


const inputField = "10, J. Kubiliaus g., \u017dirm\u016bn\u0173 seni\u016bnija, Vilnius, Vilnius city municipality, Vilnius County, 08239, Lithuania";
const longitude = 25.29739379882812;
const latitude = 54.709598364813246;

function handleMapClickResponseMocking() {
    const firstResponse = {"waypoints":[{"nodes":[4016671678,0],"location":[25.297101,54.709646],"hint":"QOEHAGgICYCdAQAAkAAAAAAAAAAAAAAAEISsQsyf70EAAAAAAAAAAM8AAABIAAAAAAAAAAAAAABIAAAAzQCCAY7NQgPyAYIBXs1CAwAAPwz1vMOL","name":"","distance":19.569841},{"nodes":[0,59986288],"location":[25.29783,54.709528],"hint":"xB0AgEbkBAAVAAAAMQAAAAAAAAAAAAAAN0bAQeG9V0IAAAAAAAAAABUAAAAxAAAAAAAAAAAAAABIAAAApgOCARjNQgPyAYIBXs1CAwAA_wD1vMOL","name":"J. Kubiliaus g.","distance":29.078142},{"nodes":[0,4016671669],"location":[25.296975,54.709387],"hint":"XggJgGkICQBPAQAAAAAAAAAAAAAAAAAAtoeLQgAAAAAAAAAAAAAAAKcAAAAAAAAAAAAAAAAAAABIAAAATwCCAYvMQgPyAYIBXs1CAwAA_wD1vMOL","name":"","distance":35.716772}],"code":"Ok"};
    const secondResponse = {"place_id":"92715255","licence":"https:\/\/locationiq.com\/attribution","osm_type":"way","osm_id":"52074970","lat":"54.71000655","lon":"25.2976787","display_name":"10, J. Kubiliaus g., \u017dirm\u016bn\u0173 seni\u016bnija, Vilnius, Vilnius city municipality, Vilnius County, 08239, Lithuania","address":{"house_number":"10","road":"J. Kubiliaus g.","suburb":"\u017dirm\u016bn\u0173 seni\u016bnija","city":"Vilnius","state_district":"Vilnius city municipality","state":"Vilnius County","postcode":"08239","country":"Lithuania","country_code":"lt"},"boundingbox":["54.7096177","54.7103954","25.2973561","25.2980013"]};
    fetch.mockResponse(JSON.stringify(firstResponse));
    fetch.mockResponse(JSON.stringify(secondResponse));
}

it("renders without crashing", () => {
    shallow(<DriverMap />);
});

it("directly handles from address change", () => {
    const driverWrapper = shallow(<DriverMap />);
    const inputField = {value: null};
    fetch.mockResponse();
    
    driverWrapper.instance().autocompleteInput = inputField;
    driverWrapper.instance().handleFromAddressChange(address);

    expect(driverWrapper.state("isFromAddressEditable")).toBe(true);
    expect(driverWrapper.state("fromAddress")).toBe(address);
    expect(fetch).toBeCalled();
});

it("directly handles to address change", () => {
    const driverWrapper = shallow(<DriverMap />);
    const inputField = {value: null};
    fetch.mockResponse();

    driverWrapper.instance().autocompleteInput = inputField;
    driverWrapper.instance().handleToAddressChange(address);

    expect(driverWrapper.state("isFromAddressEditable")).toBe(false);
    expect(driverWrapper.state("toAddress")).toBe(address);
    expect(fetch).toBeCalled();
});

it("directly handle map click when direction is from", () => {
    const driverWrapper = shallow(<DriverMap />);
    driverWrapper.setState({isFromAddressEditable: true});
    handleMapClickResponseMocking();

    driverWrapper.instance().autocompleteInput = inputField;
    driverWrapper.instance().handleMapClick(longitude, latitude).then(() => {
        expect(fetch).toBeCalled();
        expect(fetch.mock.calls.length).toEqual(2);
        expect(driverWrapper.state("fromAddress")).toBe(mapClickAddress);
    });
});

it("directly handle map click when direction is to", () => {
    const driverWrapper = shallow(<DriverMap />); 
    driverWrapper.setState({isFromAddressEditable: false});
    handleMapClickResponseMocking();

    driverWrapper.instance().autocompleteInput = inputField;
    driverWrapper.instance().handleMapClick(longitude, latitude).then(() => {
        expect(fetch).toBeCalled();
        expect(fetch.mock.calls.length).toEqual(2);
        expect(driverWrapper.state("toAddress")).toBe(mapClickAddress);
    });
});

it("directly update map", () => {
    const driverWrapper = shallow(<DriverMap />); 
    const createRouteResponse = "";
    const geometry = "{}_mIkphyCfIs@j@tGfP|P{@pf@mE`Cx`@}Hxa@`Bnw@zYdOvSrm@iFr_@nIhTV|EbJTrT|Eri@nHpIdPbGdGkCdPi[}AZkAsC";

    driverWrapper.setState({fromAddress: address});
    driverWrapper.setState({toAddress: officeAddress});
    fetch.mockResponse(JSON.stringify(createRouteResponse));

    driverWrapper.instance().updateMap().then(() => {
        expect(fetch).toBeCalled();
        expect(driverWrapper.state("routeGeometry")).toBe(geometry);
    });
});