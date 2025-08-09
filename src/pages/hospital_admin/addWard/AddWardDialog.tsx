import * as React from "react";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./addWard.module.scss";
import InputLabel from "@mui/material/InputLabel";
import { wardType } from "../../../types";
import { authPost } from "../../../axios/useAuthPost";
import { debounce, DEBOUNCE_DELAY } from "../../../utility/debounce";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectCurrentUser } from "../../../store/user/user.selector";
import { useDispatch } from "react-redux";
import {
  setError,
  setLoading,
  setSuccess,
} from "../../../store/error/error.action";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { OutlinedInput, Checkbox, ListItemText } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const amenitieslist = [
  "Air conditioned",
  "Separate room for the relative",
  "Separate living and dining area",
  "Coffee and Tea Machine",
  "Sink",
  "Attached washroom with shower",
  "LED Television",
  "Refrigerator",
  "Microwave",
  "Books and board games",
  "Choice of Multi cuisine diet",
  "Sofa set for guest",
  "Manual bed",
  "Automatic bed",
  "Patient Attendant bed",
  "WIFI (internet)",
  "Common washroom",
  "Water Purifier",
];

type addWardProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<wardType[]>>;
};

export default function AddWardDialog({ setOpen, setData }: addWardProps) {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const initialState: wardType = {
    name: "",
    floor: "",
    room: "",
    description: "",
    id: 0,
    totalBeds: 0,
    availableBeds: 0,
    price: 0,
    Attendees: "",
    location: "",
    amenities: [],
  };

  const [inputWard, setInputWard] = React.useState<wardType>(initialState);
  const [selectedList, setSelectedList] = React.useState<wardType[]>([]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(
    []
  );
  const [showError, setShowError] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    setShowError(true);

    const wards = selectedList.length
      ? selectedList.map(({ id, ...el }) => ({
          name: el.name,
          floor: el.floor,
          location: el.location,
          room: el.room,
          price: el.price,
          Attendees: el.Attendees,
          amenities: el.amenities,
          totalBeds: el.totalBeds,
        }))
      : [
          {
            ...(({ id, ...rest }) => rest)(inputWard), // Exclude `id` from `inputWard`
            amenities: selectedAmenities,
          },
        ];

    const data = await authPost(`ward/${user.hospitalID}`, wards, user.token);
    setShowError(false);

    if (data.message === "success") {
      dispatch(setSuccess("Wards successfully added"));
      setData((state) => [
        ...data.wards.map((ward: wardType) => ({
          name: ward.name,
          id: ward.id,
          totalBeds: ward.totalBeds,
          availableBeds: ward.availableBeds,
        })),
        ...state,
      ]);
      setTimeout(handleClose, 1000);
    } else {
      dispatch(setError(data.message));
    }
    dispatch(setLoading(false));
  };
  const debouncedHandleSubmit = debounce(handleSubmit, DEBOUNCE_DELAY);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputWard((prev) => ({
      ...prev,
      [name]: name === "totalBeds" || name === "price" ? Number(value) : value,
    }));
  };

  const handleAmenitiesChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    setSelectedAmenities(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <div>
      <DialogTitle>Add Ward</DialogTitle>
      <DialogContent sx={{ width: "100%", margin: "0 auto" }}>
        <div className={styles.department_dialog}>
          <Grid container alignItems="center" spacing={2} sx={{ mt: "10px" }}>
            {/* Ward Name */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                required
                label="Ward Name"
                name="name"
                value={inputWard.name}
                onChange={handleInputChange}
                placeholder="ex: special ward"
                error={showError && !inputWard.name}
              />
            </Grid>

            {/* Room */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                required
                label="Room"
                name="room"
                value={inputWard.room}
                error={showError && !inputWard.room}
                onChange={handleInputChange}
                placeholder="ex: Two Sharing Room, Deluxe Room"
              />
            </Grid>

            {/* Floor */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                required
                label="Floor"
                name="floor"
                value={inputWard.floor}
                error={showError && !inputWard.floor}
                onChange={handleInputChange}
                placeholder="ex: First Floor, Second Floor"
              />
            </Grid>

            {/* Location */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                required
                label="location"
                name="location"
                value={inputWard.location}
                error={showError && !inputWard.location}
                onChange={handleInputChange}
                placeholder="ex: Block-A Left Side"
              />
            </Grid>

            {/* Attendes */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                label="Attendees"
                name="Attendees"
                value={inputWard.Attendees}
                onChange={handleInputChange}
                placeholder="ex: One Person"
              />
            </Grid>

            {/* Total Beds */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                required
                label="Beds"
                name="totalBeds"
                type="number"
                error={showError && !inputWard.totalBeds}
                inputProps={{ min: 0 }}
                value={inputWard.totalBeds}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Price Per Bed */}
            <Grid item xs={5}>
              <TextField
                fullWidth
                required
                label="Price Per Bed"
                name="price"
                type="number"
                inputProps={{ min: 0 }}
                value={inputWard.price}
                error={showError && !inputWard.price}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Amenities */}
            <Grid item xs={5}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="amenities-label">Amenities</InputLabel>
                <Select
                  labelId="amenities-label"
                  id="amenities-select"
                  multiple
                  value={selectedAmenities}
                  onChange={handleAmenitiesChange}
                  input={<OutlinedInput label="Amenities" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {amenitieslist.map((amenity) => (
                    <MenuItem key={amenity} value={amenity}>
                      <Checkbox checked={selectedAmenities.includes(amenity)} />
                      <ListItemText primary={amenity} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={1}>
              <Button
                variant="contained"
                disabled={
                  !inputWard.name ||
                  !inputWard.totalBeds ||
                  !inputWard.room ||
                  !inputWard.floor ||
                  !inputWard.price ||
                  !inputWard.location
                }
                onClick={() => {
                  const updatedWard = {
                    ...inputWard,
                    amenities: selectedAmenities,
                  };
                  setSelectedList((state) => [...state, updatedWard]);
                  setInputWard(initialState);
                  setShowError(false);
                  setSelectedAmenities([]);
                }}
                endIcon={<AddIcon />}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </div>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          rowGap={1}
          sx={{ mt: "10px" }}
        >
          {selectedList.map((el) => (
            <Chip
              key={el.name}
              label={`Ward: ${el.name}, Room: ${el.room}, Floor: ${
                el.floor
              }, Beds: ${el.totalBeds}, Price: ${
                el.price
              }, Amenities: ${el.amenities.join(", ")}`}
              onDelete={() => {
                setSelectedList((curr) =>
                  curr.filter((dep) => dep.name !== el.name)
                );
              }}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          disabled={selectedList?.length === 0}
          onClick={debouncedHandleSubmit}
          variant="contained"
        >
          Submit
        </Button>
      </DialogActions>
    </div>
  );
}
