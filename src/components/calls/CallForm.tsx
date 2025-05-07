import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Image as ImageIcon, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  callerName: z.string().min(2, { message: "Caller name is required" }),
  callerEmail: z
    .string()
    .email({ message: "Please enter a valid email address" }),
  callerPhone: z
    .string()
    .min(10, { message: "Please enter a valid phone number" }),
  issueDescription: z
    .string()
    .min(10, { message: "Please provide a detailed description" }),
  priority: z.string(),
  status: z.string(),
  issueImage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CallFormProps {
  initialData?: FormValues;
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const CallForm = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: CallFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultValues: FormValues = initialData || {
    callerName: "",
    callerEmail: "",
    callerPhone: "",
    issueDescription: "",
    priority: "medium",
    status: "new",
    issueImage: "",
  };

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.issueImage || null,
  );
  const pasteAreaRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleImagePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        if (!blob) continue;

        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          setImagePreview(imageData);
          setValue("issueImage", imageData);
        };
        reader.readAsDataURL(blob);
        break;
      }
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue("issueImage", "");
  };

  const handleFormSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      setError(null);

      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (err) {
      setError(
        "An error occurred while submitting the form. Please try again.",
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Edit Support Call" : "New Support Call"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Update the details of this support call"
            : "Enter the details of the new support call"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Caller Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="callerName">Name</Label>
                <Input
                  id="callerName"
                  {...register("callerName")}
                  placeholder="Enter caller's name"
                />
                {errors.callerName && (
                  <p className="text-sm text-red-500">
                    {errors.callerName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="callerEmail">Email</Label>
                <Input
                  id="callerEmail"
                  type="email"
                  {...register("callerEmail")}
                  placeholder="Enter caller's email"
                />
                {errors.callerEmail && (
                  <p className="text-sm text-red-500">
                    {errors.callerEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="callerPhone">Phone Number</Label>
                <Input
                  id="callerPhone"
                  {...register("callerPhone")}
                  placeholder="Enter caller's phone number"
                />
                {errors.callerPhone && (
                  <p className="text-sm text-red-500">
                    {errors.callerPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Issue Details</h3>
            <div className="space-y-2">
              <Label htmlFor="issueDescription">Description</Label>
              <Textarea
                id="issueDescription"
                {...register("issueDescription")}
                placeholder="Describe the issue in detail"
                className="min-h-[120px]"
              />
              {errors.issueDescription && (
                <p className="text-sm text-red-500">
                  {errors.issueDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Issue Screenshot</Label>
              <div
                ref={pasteAreaRef}
                onPaste={handleImagePaste}
                className="border border-dashed border-input rounded-md p-4 min-h-[120px] flex flex-col items-center justify-center cursor-pointer bg-muted/30"
                tabIndex={0}
                onClick={() => pasteAreaRef.current?.focus()}
              >
                {imagePreview ? (
                  <div className="relative w-full">
                    <div className="absolute top-2 right-2 z-10">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <img
                      src={imagePreview}
                      alt="Issue screenshot"
                      className="max-h-[300px] max-w-full object-contain mx-auto rounded-md"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <p className="text-sm">Paste an image here (Ctrl+V)</p>
                    <p className="text-xs mt-1">
                      Click to focus this area, then paste your screenshot
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Priority</h3>
              <Select
                defaultValue={defaultValues.priority}
                onValueChange={(value) => setValue("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status</h3>
              <RadioGroup
                defaultValue={defaultValues.status}
                onValueChange={(value) => setValue("status", value)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="status-new" />
                  <Label htmlFor="status-new">New</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-progress" id="status-in-progress" />
                  <Label htmlFor="status-in-progress">In Progress</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="on-hold" id="status-on-hold" />
                  <Label htmlFor="status-on-hold">On Hold</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="resolved" id="status-resolved" />
                  <Label htmlFor="status-resolved">Resolved</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Submitting..."
              : isEditing
                ? "Update Call"
                : "Create Call"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CallForm;
